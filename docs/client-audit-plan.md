# BRAGram Client 감사 & 수정 계획

## Context

`apps/client`를 **ponytail(과잉설계)**, **FSD v2.1(아키텍처)**, **로직 정확성** 세 렌즈로 감사한 뒤, 결과를 **4관점 × 적대적 검증자 2인**으로 두 차례 교차 반박했다(계획 검토 1회, 캘린더 API 설계 1회). 이 문서는 그 최종본이다.

모든 항목은 실제 소스에서 `file:line`으로 확인했다.

### 확정된 제품 결정

**캘린더는 활성월 + 이전월 2개를 유지한다.** 한때 "한 달만 표시"로 줄이려 했으나, 그 근거였던 "데이터 범위 절반"이 **S1(캘린더 전용 집계 API)로 소멸**했다 — 2개월 비용이 4쿼리 / 9 KB / 병렬 1웨이브로 상한이 걸리기 때문이다. 화면 단순화 목적의 축소는 별도 제품 판단으로 분리한다(원하면 `calendar-view.tsx`에서 두 번째 `<Calendar>` 블록만 지우면 되는 1회성 변경).

### 수정 방침 — 증상 패치보다 근본 원인

| 항목 | 초안(증상 패치) | 최종(근본 수정) |
|---|---|---|
| **캘린더** | effect 의존성 한 줄 수정 | **전용 집계 API(S1)** — 피드용 무한스크롤을 빌려 쓰던 구조 자체를 교체 |
| **auth 중복 호출** | 모듈 플래그 | **`_retry: true` 재사용** — 인터셉터 재귀를 끊음 |
| **무한스크롤** | `isFetchingNextPage`를 prop으로 3곳 전달 | **`data.pages.length` deps 1줄** — 실패 루프 회피 |
| **URL 누수** | `shared/hooks` 훅 신설 | **3줄 인라인 × 3곳** — `shared/hooks`는 존재하지도 않음 |
| **더블 제출** | `useRef` 가드 | **`useState` + 버튼 라벨** |
| **캡처 지연** | 워밍업 축소 | **대기 대상 명시**(`document.fonts.ready` + `decode()`) |

**하지 않기로 확정**: P2(`METHOD:` 제거) · P9(`getNextPageParam` 헬퍼) · B6 공통 훅 · B2 전면 무효화 → 근거는 Appendix.

### 초안의 사실 오류 (정정 완료)

1. `shared/hooks` 디렉터리가 있다 → **없다**(`api·assets·boundary·lib·ui`)
2. 좋아요가 즉시 반영된다 → **아니다**(`onSuccess`에서만 패치)
3. 캐러셀 소비처는 3개 컴포넌트만 쓴다 → **`CarouselApi`·`setApi`·`scrollTo`·`on('select')`도 쓴다**
4. `pet-search-list`는 이미 올바르다 → **같은 실패 재요청 루프가 있다**
5. `packages/schemas`는 no-build 소스 직접 참조 → **타입만 소스, 런타임은 `dist`**(아래 S1 함정 ① 참조)

> `apps/client/CLAUDE.md`도 shared에 `hooks`/`store`, widgets에 `bottom-nav`/`pet`이 있다고 기술하나 **모두 실재하지 않는다.** 별건으로 정정 권장.

---

## Phase 0 (PR ⓪) — S1: 캘린더 전용 집계 API

> 3패키지(schemas + server + client) 변경. **Phase 1보다 먼저** 진행한다 — 순서를 바꾸면 Phase 1에서 쓴 캘린더 코드를 다음 PR에서 통째로 지우게 된다.

### 왜 지금인가

캘린더는 나중에 추가된 기능이라 **피드용 무한스크롤 API를 그대로 빌려 쓰고 있다**(`/posts/me`, `/posts/pets/:petId`, LIMIT 20 커서). 여기서 두 가지 문제가 나온다.

**① 데이터가 조용히 소실된다(정확성 문제).** `useCalendarView.ts:15-19`의 effect는 `[hasNextPage, fetchNextPage]`가 페치 중 불변이라 **1회만 실행된다** → 정확히 2페이지 = **40건에서 멈춘다.** 41건 이상인 계정은 과거 달이 빈칸으로 보이고, tsc·lint·런타임 어디서도 경고가 없다.

**② 비용이 "보려는 달"이 아니라 "오늘로부터의 거리"에 비례한다(구조 문제).** 커서가 `id DESC`라 작년 3월을 보려면 그 사이 전부를 긁어야 한다.

여기에 **과다 페치**가 겹친다 — 타일이 실제로 쓰는 건 날짜당 2개 필드뿐인데(`calendar-tile.tsx:18,22`) 한 달치 `PostDetail` 전체를 받고, 서버는 그때마다 `getLikedPosts`+`getLikeCounts` **DB 쿼리 2개를 추가로** 돈다(`post.service.ts:117-121`). `likeCount`/`isLiked`는 모달에서만 쓴다.

### 엔드포인트

```
GET /posts/calendar?month=YYYY-MM&petId={number?}
  @UseGuards(JwtAuthGuard)
  - petId 생략 → 대표펫 (findMyPosts와 동일 규칙, post.service.ts:80-84)
  - petId 지정 → 해당 펫 (현행 findPetPosts와 동일하게 소유권 검사 없음 = 동작 보존)
  - 대표펫 없음 → []
  - 200 → CalendarDay[]  (ResponseInterceptor가 {success,data}로 감쌈)

모달: 기존 GET /posts/:id 재사용 → 서버 신규 코드 0줄
삭제(배포 3단계): GET /posts/me, GET /posts/pets/:petId
```

⚠️ **`@Get('calendar')`는 반드시 `@Get(':id')`(`post.controller.ts:97`) 앞에 선언.** `@Get('me')`·`@Get('liked')`가 앞에 있는 것과 같은 관례. 뒤에 두면 `ParseIntPipe`에 걸려 400이 난다.

### zod 스키마

```ts
// packages/schemas/post/index.ts

export const CalendarQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month는 YYYY-MM 형식이어야 합니다.'),
  petId: z.coerce.number().int().positive().optional(),
});

/** 캘린더 타일 1칸 = 그 날의 대표(최신) 게시물 요약 + 모달용 id 목록 */
export const CalendarDaySchema = z.object({
  date: z.string(),             // KST 'YYYY-MM-DD' — toDateKey()와 동일 포맷
  thumbnailUrl: z.string(),     // 최신 글의 imageUrls[0]   ← calendar-tile.tsx:18
  isMission: z.boolean(),       // 최신 글의 type==='mission' ← calendar-tile.tsx:22
  postIds: z.array(z.number()), // id DESC. 모달이 이 id로 /posts/:id 를 연다
});

export const CalendarMonthResponseSchema = z.array(CalendarDaySchema);

export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;
export type CalendarDay = z.infer<typeof CalendarDaySchema>;
export type CalendarMonthResponse = z.infer<typeof CalendarMonthResponseSchema>;
```

- **삭제**: `CalendarPostListResponseSchema`(`:41-45`), `CalendarPostListResponse`(`:52`) → 잔여 참조를 tsc가 전부 열거해준다.
- ⚠️ **`PostQuerySchema`(`:12`)는 절대 건드리지 말 것** — 무인증 `GET /posts`(`post.controller.ts:48`, 가드 없음)가 같은 스키마를 쓴다. 여기에 `date`/`from`/`to`/LIMIT을 얹으면 공개 피드의 동작이 요청 없이 바뀐다.
- `PostDetailSchema`(`:25`)는 모달이 계속 쓰므로 무수정.
- `thumbnailUrl` non-null 근거: `ImagesValidationPipe` min 1(`image-upload.decorator.ts:57,61-63`) + posts insert 경로가 `post.service.ts:58` 하나뿐 → `image_urls.length >= 1` 보장.

### 핵심 쿼리

```ts
// apps/server/src/post/post.repository.ts — 메서드 1개 추가 (import에 gte, sql 추가)

const KST_DAY = sql<string>`to_char(${posts.createdAt} + interval '9 hours', 'YYYY-MM-DD')`;

async findCalendarDays(petId: number, fromUtc: Date, toUtc: Date) {
  return this.db
    .select({
      date: KST_DAY,
      postIds: sql<number[]>`array_agg(${posts.id} order by ${posts.id} desc)`,
      thumbnailUrl: sql<string>`(array_agg(${posts.imageUrls}->>0 order by ${posts.id} desc))[1]`,
      isMission: sql<boolean>`(array_agg(${posts.type}::text order by ${posts.id} desc))[1] = 'mission'`,
    })
    .from(posts)
    .where(and(
      eq(posts.petId, petId),
      gte(posts.createdAt, fromUtc),   // ← bare 컬럼. sargable.
      lt(posts.createdAt, toUtc),
    ))
    .groupBy(KST_DAY)
    .orderBy(KST_DAY);
}
```

**KST 경계** — `post.service.ts` private 헬퍼 2줄:

```ts
// 한국은 DST 없음(UTC+9 고정) → interval '9 hours' 상수와 정확히 짝이 맞는다.
// Date.UTC의 월 오버플로가 12월 롤오버를 알아서 처리한다.
private monthRangeUtc(month: string): [Date, Date] {
  const [y, m] = month.split('-').map(Number);
  return [new Date(Date.UTC(y, m - 1, 1, -9)), new Date(Date.UTC(y, m, 1, -9))];
}
// '2026-08' → [2026-07-31T15:00:00.000Z, 2026-08-31T15:00:00.000Z)
```

⚠️ **WHERE에 KST 변환식을 넣으면 안 된다.** `idx_post_pet_created(pet_id, created_at)`(`schema/posts.ts:33`)는 컬럼 값 기준 b-tree라 `(created_at + interval '9 hours')::date >= …` 형태는 range scan이 불가능하다. 경계를 앱에서 UTC로 환산해 bare 컬럼에 걸면 `pet_id` equality + `created_at` range = 복합 인덱스 교과서 케이스.

**신규 인덱스 0건, 마이그레이션 0건.** drizzle 0.45.2에서 위 쿼리의 `toSQL()` 렌더를 확인했다.

### 서버 변경

| 파일 | 변경 |
|---|---|
| `packages/schemas/post/index.ts` | + 스키마 3개·타입 3개(~15줄). − `CalendarPostListResponseSchema`·타입 |
| `post.repository.ts` | + `findCalendarDays`(위). `import { gte, sql }` 추가 |
| `post.service.ts` | + `findCalendarDays`(대표펫 조회 → `monthRangeUtc` → repository) + `monthRangeUtc` 헬퍼. − `findMyPosts`(`:76-94`)·`findPetPosts`(`:96-110`)·`toCalendarPostListResponse`(`:112-136`) |
| `post.controller.ts` | + `@Get('calendar')`(`:97` 앞). − `@Get('me')`(`:57-68`)·`@Get('pets/:petId')`(`:70-82`) |
| `post.service.spec.ts` / `post.controller.spec.ts` | 삭제된 메서드 테스트 제거 + `monthRangeUtc` 경계 테스트 2줄 추가 |

**서버 순증 ≈ −5줄.**

### 클라 변경

**신규 2파일**

- `features/calendar/api/useCalendarMonthQuery.ts`
  ```ts
  export const calendarMonthQueryOptions = (month: string, petId?: number) => ({
    queryKey: postQueryKeys.calendarMonth(month, petId),
    queryFn: () => apiClient.get<CalendarMonthResponse>(
      API_ROUTES.POSTS.GET_CALENDAR.URL, { params: { month, petId } }),
  });
  ```
- `features/calendar/hooks/useCalendarMonths.ts` — **`useCalendarView.ts` + `usePetCalendarView.ts` 2파일을 대체**한다(`petId?`가 파라미터가 되면서 자연 병합 = R2 흡수). `useState` lazy init(현재 `:6-9`는 매 렌더 `new Date()`), `useSuspenseQueries` 2개(활성월/이전월), `startTransition`, `daysByDate = Object.fromEntries(...)`.

**수정**

| 파일 | 변경 |
|---|---|
| `shared/api/api-routes.constants.ts` | + `GET_CALENDAR: { URL: '/posts/calendar' }`. − `GET_MY_POSTS`·`GET_PET_POSTS` |
| `entities/post/model/post.query-key.ts` | + `calendarMonth: (month, petId?) => [...calendar(), petId ?? 'me', month]`. − `myPosts()`·`petPosts()`. **`calendar()` 프리픽스 유지** → `all` 무효화가 계속 커버 |
| `features/calendar/lib/calendar.ts` | + `toMonthKey` 1줄. **`toDateKey`(`:1-6`)는 무수정** |
| `features/calendar/ui/calendar-view.tsx` | `:31` 타입 → `Record<string, CalendarDay>`, `:47` `day={daysByDate[toDateKey(date)]}`, `:51` 가드, `:95-101` 모달에 `postIds` 전달. 래퍼 3개(`:106-119`) → 1개 |
| `features/calendar/ui/calendar-tile.tsx` | prop `post?: PostDetail` → `day?: CalendarDay`, `day.thumbnailUrl`, `day.isMission` (**실질 3줄**) |
| `features/calendar/ui/calendar-post-detail-modal.tsx` | props `posts` → `postIds: number[]`. 내부 Body에서 `useSuspenseQueries(postIds.map(getPostQueryOptions))` → `PostDetail[]`. `withSuspense`/`withErrorBoundary` 기존 파일 재사용 |
| `features/like/lib/patch-like-cache.ts` | **`:10-24` 블록 + `InfiniteData`/`CalendarPostListResponse` import 삭제.** `:26-28`(detail 패치)만 남는다 → **29줄 → 12줄** |
| `features/pet/edit/api/useRepresentativePetMutation.ts:26` | `myPosts()` → `calendar()` |

**삭제**: `useCalendarView.ts`(32) · `usePetCalendarView.ts`(32) · `features/calendar/model/calendar.ts`(15, 서버가 그룹핑) · `useGetMyPostsInfiniteQuery.ts`(30) · `useGetPetPostsInfiniteQuery.ts`(27)

**무수정**: `calendar-post-detail.tsx` — **진짜로 0줄.** 여전히 `PostDetail[]`을 받고 `pet.id`·`pet.name`·`likeCount`·`isLiked`가 전부 들어온다. `posts.length === postIds.length`가 구조적으로 보장되므로 빈 배열 크래시 경로가 생기지 않는다. `useDeletePostMutation`/`useCreatePostMutation`/`useSubmitMissionMutation`도 전부 `postQueryKeys.all` 무효화라 무수정.

**클라 순증 ≈ −80줄. 전체 diff 순감소.**

⚠️ **`startTransition`은 선택이 아니라 필수다.** `useSuspenseQueries`의 월 키가 바뀌면 컴포넌트가 서스펜드하고 `withSuspense(CalendarView, <CalendarViewSkeleton/>)`(`calendar-view.tsx:121-122`)가 **헤더·네비 버튼까지 포함해 화면 전체를 스켈레톤으로** 갈아끼운다. `UseSuspenseQueryOptions`는 타입 레벨에서 `placeholderData`를 Omit하므로 우회로가 이것뿐이다.

```ts
const shift = (n: number) => startTransition(() =>
  setActiveStartDate(d => new Date(d.getFullYear(), d.getMonth() + n, 1)));
// isPending으로 opacity-60 정도만
```

### 모달(하루 상세)

요약 응답의 `postIds`(id DESC)를 모달에 넘기고, 모달 Body가 기존 `getPostQueryOptions`(`useGetPostQuery.ts:11`)를 `useSuspenseQueries`로 팬아웃한다. **서버 신규 코드 0줄.**

이득 3가지:
1. `calendar-post-detail.tsx` 완전 무수정
2. `patch-like-cache.ts`가 재작성이 아니라 **축소** — 모달이 `detail()` 캐시를 읽으므로 `:26-28`이 이미 커버
3. 같은 글 재오픈은 캐시 히트 0왕복, 좋아요 숫자가 진입 시점에 굳지 않고 최신값

비용: 하루 k건인 날에 k개 병렬 요청. 미션 글은 펫당 1건이고(`posts_pet_mission_unique`) 캐러셀은 게시물당 `imageUrls[0]`만 쓰므로 k는 대개 1~2다. **k > 3이 실측되면 그때 `GET /posts/calendar/day?date=`를 추가한다** — 그 시점에도 클라 변경은 훅 하나 교체.

### 정량 비교

`PostDetail` ≈ 345 B, `CalendarDay`(postIds 1개) ≈ 155 B. 전부 **비압축 wire**(서버에 compression 없음). "현재"는 실측 동작(effect 1회 = 2페이지 상한).

| 계정 | | 현재 | 권고안 (달력 2개) |
|---|---|---|---|
| **30건** | 왕복 / DB / 크기 | 2(순차) / 8 / 10.1 KB | **2(병렬) / 4 / 3.9 KB** |
| | 정확성 | OK | OK |
| **300건** | 왕복 / DB / 크기 | 2 / 8 / 13.5 KB | **2(병렬) / 4 / 8.6 KB** |
| | 정확성 | **260건 미도착** | OK |
| **3000건** | 왕복 / DB / 크기 | 2 / 8 / 13.5 KB | **2(병렬) / 4 / ~11 KB** |
| | 정확성 | **2960건 미도착** | OK |

- **월 이동 1스텝**: 현재 0왕복(캐시에 있는 만큼만, 없으면 영영 안 옴) → 권고안 **1요청 / 2쿼리 / ~4.5 KB**(월 단위 키라 나머지 한 달은 캐시 히트)
- **모달 1회 오픈(신규 비용)**: +k 요청(병렬). 재오픈 0

**핵심은 배수가 아니라 기울기다.** 그리드 비용이 `O(표시 월 수)`로 상한이 걸리고 게시물 총량·오늘로부터의 거리와 완전히 무관해진다. 2024년 3월로 이동해도 1요청 / 4.5 KB. **6개월 표시로 늘려도 최대 186행 ≈ 29 KB / 12쿼리** → 달력 개수는 더 이상 제약이 아니다.

### ⚠️ 함정 체크리스트

1. **`pnpm --filter=@pawboo/schemas build` 필수.** `packages/schemas/package.json:8-17`의 exports가 `types`는 소스(`./*/index.ts`), `default`는 **`./dist/*/index.js`**다. 서버는 `nest-cli.json`이 `webpack: true`라 번들에 `@pawboo/schemas/*`가 external로 남고 **런타임은 dist를 읽는다.** `prebuild`는 `build`에만 걸리고 `start:dev`에는 없다. 새 zod 스키마는 **값**으로 쓰이므로 빌드 누락 시 `CalendarQuerySchema undefined`로 즉사한다(tsc는 통과).
2. **`@Get('calendar')`를 `@Get(':id')` 앞에.**
3. **`startTransition` 없이 진행 금지.** 이 설계에서 유일하게 "안 하면 지금보다 나빠지는" 항목.
4. **`PostQuerySchema` 무수정.** 무인증 `GET /posts`와 공유.
5. **`patch-like-cache.ts` 축소는 blocking.** 안 지우면 새 월별 키에 `old.pages.map`이 걸려 좋아요 토글이 TypeError로 터진다.
6. **타입 게이트는 수동.** root/client/server 어디에도 `tsc --noEmit` 스크립트가 없고 CI(.github/workflows)도 없다. PR 체크리스트에 명시할 것.

### 배포 순서 (breaking)

1. `pnpm --filter=@pawboo/schemas build` → **서버 배포**(`@Get('calendar')` 추가만, 기존 라우트 유지)
2. **클라 배포**
3. 후속 PR: `/posts/me`·`/posts/pets/:petId` + `findMyPosts`/`findPetPosts`/`toCalendarPostListResponse` + `CalendarPostListResponseSchema` 제거

이 순서면 서버 선배포 구간에 404가 나지 않는다.

### 검증

| # | 항목 | 방법 |
|---|---|---|
| 1 | DB 세션 TimeZone이 UTC | 배포 전 `SHOW timezone;` 1회. 어긋나면 **에러 없이 전 날짜가 9시간 밀린다**(기존에도 성립하던 암묵 전제) |
| 2 | GROUP BY 표현식 매칭 | 개발 DB에서 렌더된 SQL 1회 실행 |
| 3 | 인덱스 사용 | `EXPLAIN`에 `Index Scan using idx_post_pet_created` + `Index Cond: (pet_id = … AND created_at >= … AND created_at < …)`. Seq Scan이면 WHERE에 함수가 섞인 것 |
| 4 | **KST 경계 오프바이원** (가장 실수하기 쉬운 유일한 로직) | 유닛 2줄: `monthRangeUtc('2026-08')` → `['2026-07-31T15:00:00.000Z','2026-08-31T15:00:00.000Z']`, `monthRangeUtc('2026-12')[1]` → `'2026-12-31T15:00:00.000Z'`. 실기: `2026-08-01 00:30 KST` 게시물이 `month=2026-08`에만 들어오는지 |
| 5 | 월 이동 깜빡임 | 화살표 연타 시 헤더·네비가 유지되는지 |
| 6 | 삭제 레이스 | 모달 열고 삭제 → 에러 바운더리로 안 튀는지 |
| 7 | 41건 이상 계정 | 과거 달이 **채워지는지**(현재 버그의 회귀 테스트) |

---

## Phase 1 (PR ①) — 로직 버그 & UX (클라 전용)

### B2 [Med] 좋아요 — `liked()` 갱신 + 낙관적 반영

> **S1 이후에 진행할 것** — S1이 같은 파일(`patch-like-cache.ts`)을 축소한다.

- **증상 ①**: `liked()` 캐시가 갱신되지 않아 좋아요 목록에서 해제해도 항목이 남는다.
- **증상 ②**: 탭해도 숫자·색이 **서버 왕복이 끝날 때까지 그대로**다(`onSuccess`에서만 패치). 버튼은 `disabled`될 뿐이고 `disabled:` 스타일조차 없어 시각 피드백이 0이다.
- **분석**: S1 이후 like 상태를 담는 캐시는 **`detail()` 하나뿐**이다(그리드는 `CalendarDay`라 like 정보 없음). `liked()`는 상태가 아니라 **목록 멤버십** 문제라 무효화가 맞다.
- **수정 ①** — 무효화는 **두 mutation의 `onSuccess`에**(패치 함수 안이 아니라):
  ```ts
  onSuccess: (data, submissionId) => {
    patchLikeInCaches(submissionId, data);
    queryClient.invalidateQueries({ queryKey: postQueryKeys.liked() });
  },
  ```
- **수정 ②** — 낙관 반영 5줄(`like-button.tsx`):
  ```tsx
  const handleClick = () => {
    const before = { likeCount, isLiked };
    patchLikeInCaches(submissionId, { likeCount: likeCount + (isLiked ? -1 : 1), isLiked: !isLiked });
    (isLiked ? removeLike : addLike)(submissionId, {
      onError: () => patchLikeInCaches(submissionId, before),
    });
  };
  ```
  `LikeButton`이 controlled(`385943b`)라 롤백값이 props에 있다.

### B3+B5 [Med] 캡처 중 더블 제출 & 무반응

- **위치**: `image-editor-form.tsx:58-65`, 버튼 `:146-152`
- **증상**: `capture()`(2048² PNG, 수 초) 후에야 `isPending`이 켜진다. 그 사이 버튼이 활성이라 더블탭이 통과.
- **서버 방어 여부**: **미션**은 `posts_pet_mission_unique`로 방어되지만, **일반 게시물은 `missionId`가 NULL이라 제약이 무효**이고 중복 검사도 없다 → **실제로 2건 생성 + S3 업로드 2회.**
- **수정**:
  ```ts
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFormSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCapturing) return;
    setIsCapturing(true);
    try {
      flushSync(() => setSelectedId(null));
      const file = await capture();
      if (!file) { toast.error('이미지 생성에 실패했어요. 다시 시도해주세요.'); return; } // B5
      setValue('images', [file]);
      await onSubmit();
    } finally {
      setIsCapturing(false);
    }
  };
  ```
- **버튼도 함께** — 이게 빠지면 수정의 절반이 무의미:
  ```tsx
  disabled={isPending || isCapturing || !previewUrl}
  {isPending || isCapturing ? '저장 중...' : submitLabel}
  ```
  현재 `disabled` 스타일이 하나뿐이라 라벨을 안 바꾸면 **"사진 미선택"과 "업로드 중"이 픽셀 단위로 같은 회색 버튼**이 된다. 저사양 기기에서 사용자는 중복 제출 대신 **제출 포기**를 한다.
  > `useTranslations` 불필요 — 이 파일은 전부 하드코딩 한국어이고 호출부도 `submitLabel="완료"`다.
- **왜 `useRef`가 아닌가**: ref는 리렌더를 일으키지 않아 버튼이 계속 활성처럼 보인다.

### B4 [Low-Med] 미리보기 `URL.createObjectURL` 누수 (3곳)

- **위치**: `image-editor-form.tsx:49-56`, `create-pet-form.tsx:26-32`, `edit-pet-form.tsx:34-40`
- **수정**: 세 곳에 정리 effect 인라인(3줄) + 기존 수동 revoke 삭제.
  ```ts
  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);
  ```
  `blob:` 가드가 `edit-pet-form.tsx:37`의 `previewUrl !== pet?.imageUrl` 특수 조건을 대체한다. StrictMode 이중 마운트 문제 없음(최초 마운트 시 `null` 또는 http).
- **훅 추출 안 하는 이유**: `shared/hooks`가 **존재하지 않는다.** 3줄 × 3곳에 새 세그먼트를 여는 건 P9·B6에 적용한 기준과 충돌. **B4 → R1 순서**를 지키면 R1이 펫 폼 둘을 합칠 때 한 곳으로 수렴한다.

### B6 [Med] 무한스크롤 정지 + 로딩 표시 없음

- **위치**: `post-grid-list.tsx:19-23`, `pet-search-list.tsx:22-26`
- **수정**: deps에 `data.pages.length`. **1파일 1줄**, 호출부 무수정(`data`가 이미 prop).
  ```ts
  }, [inView, hasNextPage, data.pages.length, fetchNextPage]);
  ```
- ⚠️ **`isFetchingNextPage`를 가드/deps에 넣지 말 것 — 실패 재요청 무한루프가 된다.** RQ v5 `defaultThrowOnError = (_e, q) => q.state.data === void 0`라 데이터가 있으면 실패가 던져지지 않는다. `isFetchingNextPage`는 true→false로 떨어지고 `hasNextPage`는 true 그대로 → 즉시 재요청 → 반복.
- **`pet-search-list.tsx`도 같이 고칠 것** — "이미 올바른 레퍼런스"가 아니라 **같은 루프를 갖고 있다.**
- **로딩 스켈레톤 추가**: `{isFetchingNextPage && <PostGridSkeleton />}` — **표시 전용**으로만(가드·deps 금지). import는 `./post-grid-skeleton` 직접.

### B7 [Med] refresh 401 시 중복 실행 (+F1 동반)

- **근본 원인**: 인터셉터가 자기 자신을 재귀 호출한다. `axiosInstance.post('/auth/refresh')`(`:50-51`)가 **같은 인스턴스**라 그 401이 다시 이 인터셉터로 들어오고, 그래서 `url.includes('/auth/refresh')` 특수 분기(`:42-45`)가 필요했으며 그 분기와 외부 catch가 둘 다 `handleAuthFailure()`를 부른다.
- **수정**: 이 파일이 **이미 쓰는 `_retry` 관례**를 재사용. 인스턴스는 하나 유지.
  ```ts
  refreshPromise ??= axiosInstance
    .post('/auth/refresh', null, { _retry: true } as AxiosRequestConfig)
    .then(() => {})
    .finally(() => { refreshPromise = null; });
  // + 42-45행 삭제
  // + declare module 'axios' { interface AxiosRequestConfig { _retry?: boolean } }
  ```
  `:38`의 `_retry` 가드가 `handleAuthFailure` 호출보다 **앞에** 있으므로 refresh의 401은 거기서 reject되고 catch가 1회만 돈다.
- **별도 인스턴스를 안 만드는 이유**: 요청 인터셉터(`:12-21` SSR 쿠키 주입)를 수동 재등록해야 하고, **누락 시 SSR 리프레시만 조용히 깨진다.**
- **F1 [High] 동시 적용**: `handleAuthFailure`의 `removeQueries({ queryKey: userQueryKeys.me() })` → `queryClient.clear()`, `entities/user` import 삭제(`:3`,`:25`) → shared→entities 상향 import(FSD 위반) 해소.

### B8' [Low] 초기 활성월을 KST로

- **위치**: `useCalendarMonths.ts`의 `useState` lazy init (구 `useCalendarView.ts:6-9`가 매 렌더 `new Date()`)
- **문제**: 활성월이 기기 로컬 기준이라 비-KST 기기에서 서버 KST 버킷과 "현재 달"이 어긋날 수 있다.
- **수정**: `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' })`로 현재 월을 뽑는다(1줄, `mission.service.ts:22-26` 관례).
- **그룹핑 타임존 본체는 S1로 소멸** — 서버가 KST 문자열 키를 확정해 내려주고 타일 키는 `toDateKey`(로컬 civil Date)를 그대로 쓰므로 두 키가 항상 맞물린다.
- ⚠️ **`toDateKey`를 통째로 KST화하면 안 된다** — react-calendar가 주는 로컬 자정 civil Date를 KST로 포맷하면 UTC+10 이상(시드니·오클랜드)에서 모든 타일 키가 하루 밀린다.

---

## Phase 2 (PR ②) — Dead code 제거

- **P1 [High]** 미사용 shadcn 3파일: `dropdown-menu.tsx`(228)·`tabs.tsx`(81)·`badge.tsx`(46) = **355줄**. 소비처 0. `shared/ui/index.ts` export도 제거(`:4`, `:18`, `:26-42`).
- **P2** ~~`api-routes.constants.ts`의 `METHOD:` 25개 제거~~ → **하지 않음.** `.METHOD` 코드 참조는 0건이지만, 엔드포인트별 HTTP 메서드를 확인하는 용도로 실제 사용 중이다 — 죽은 코드가 아니라 사람이 읽는 문서다.
- **P3 [Med]** `carousel.tsx` 미사용 표면 **~75줄**: `CarouselPrevious`(163-191)·`CarouselNext`(193-221) + 고아가 되는 `canScrollPrev/Next`(59-60)·`onSelect`(62-66)·리스너 effect(94-103)·Context 필드(27-28,114-115)·`Button`/`ArrowLeft`/`ArrowRight` import. barrel `:23-24`도.
  - ⚠️ **반드시 남길 것**: `setApi` effect(**89-92**, `calendar-post-detail.tsx`가 `CarouselApi`·`selectedScrollSnap()`·`on/off('select')`·`scrollTo(i)`를 실제로 씀) / `relative` 래퍼(**120**, `LikeButton`과 도트가 이 포지셔닝에 의존, 부모 `<article>`엔 `relative` 없음) / `handleKeyDown`(76-87, 접근성).
  - 렌더 출력 동일 → tsc로 검증 충분.
- **P4 [Med]** 미사용 non-suspense 훅: `useGetPostsInfiniteQuery`·`useGetLikedPostsInfiniteQuery`·`useSearchPetsInfiniteQuery` **3개**. (`useGetMyPostsInfiniteQuery`는 S1에서 파일째 삭제 → 목록에서 제외)
- **P5** `*MutationOptions` 팩토리 9개 인라인 · **P6** dead query-key(`user`: search/profile/feeds, `pet`: publicDetail/submissions) · **P7** `timeAgo` 삭제 · **P8** 유령 라우트 `MISSIONS.GET_HISTORY`·`DELETE_SUBMISSION` + `missionQueryKeys.history()` no-op 무효화 3곳(서버에 해당 엔드포인트 없음 확인) · **P10** `query-provider.tsx:10` 주석, `formatYear` → `String(getFullYear())` (**S1 이후에** — 같은 파일에 `toMonthKey`를 추가하므로) · **P11** `DialogOverlay`/`DialogPortal` barrel 재export 제거
- **P9** ~~`getNextPageParam` 헬퍼 추출~~ → **하지 않음.** 한 줄 × 3곳.

---

## Phase 3 (PR ③) — 중복 정리

### R1 [Med] `CreatePetForm`/`EditPetForm` 통합 (~60줄)
차이는 초기 previewUrl / 테두리색 / placeholder / 버튼 라벨뿐 → props. 프레젠테이셔널 `PetForm` 추출. **B4 이후에** 진행(정리 effect가 여기서 한 곳으로 수렴).

### ~~R2~~ — **S1에 흡수됨** (`useCalendarMonths.ts`가 두 훅을 대체)

### R3 [Med] `useCaptureCanvas` — 대기 조건 명시 + 포맷 판단

- **근본 원인**: `toBlob` 3회 버리고 4번째만 쓰는 것은 **경험적 워밍업**이라 무엇을 기다리는지 명시하지 않는다. 부족하면 여전히 깨지고 충분해도 3회 낭비.
- **수정**:
  ```ts
  const baseImg = ref.current.querySelector('img');
  await Promise.all([
    document.fonts.ready,               // 웹폰트 — 캔버스에 사용자 입력 텍스트가 렌더된다
    baseImg?.decode().catch(() => {}),  // 배경 이미지 디코드
  ]);
  const blob = await toBlob(ref.current, options);
  ```
- **포맷은 측정 후 결정**: 현재 출력은 **2048² 무손실 PNG**인데 서버가 `aws.service.ts:63-69`에서 **webp q85로 재인코딩**해 그 용량을 전부 버린다. multer 상한 10MB.
  - **착수 전 실기에서 `blob.size` 1회 로깅** → 1MB대면 포맷 유지, 5MB+면 `toJpeg({ quality: 0.9, backgroundColor: '#131313' })`. (`toBlob`은 옵션 없이 `canvasToBlob`을 불러 quality가 안 먹지만 `toJpeg`는 실제로 전달한다)
- ⚠️ 실기(특히 모바일 Safari)에서 배경·아이콘·**입력 텍스트**가 모두 렌더되는지 눈으로 확인. 누락되면 워밍업 1회만 남기는 절충(총 2회)으로 후퇴.

---

## Phase 4 (PR ④~⑥) — FSD 아키텍처 (전부 진행)

순서: F1(Phase 1에서 완료) → F2 → F3 → F7 → F8 → **[별도 PR]** F5/F6 → F4

- **F2 [High]** `HomePetAvatar` → `widgets/pet-avatar/`. `pages/calendar/index.tsx:5`·`pages/mission/index.tsx:3`의 page→page deep import 해소. `widgets/`는 실재하며 `header/` 하나뿐 — 그 barrel 패턴을 따를 것.
- **F3 [High]** `image-canvas` god-slice 분리
  1. 범용 primitive(`ImageCanvas`, `DraggableElement`, `useCanvasElements`, `useCaptureCanvas`, `CanvasElement`) → `shared/ui/image-canvas/`
  2. **F3-2 [결정: 삭제]** — `ImageEditorFormSchema`/`model/schema.ts`를 shared로 옮기지 **않고 삭제**한다. `image-editor-form.tsx`의 RHF는 실질적으로 아무 일도 안 한다(입력 필드 0, 값은 컴포넌트가 직접 `setValue`). `:144`의 `errors.images`는 **도달 불가능**하다 — 제출 버튼이 `!previewUrl`로 막혀 있는데 `previewUrl` 세팅 경로에서 `setValue('images')`가 함께 실행된다. 도달 불가능한 검증을 최하위 공용 레이어로 승격시킬 이유가 없다(진짜 신뢰 경계는 서버 `ImagesValidationPipe`).
     → 스키마 삭제 + dead UI 삭제 + RHF 제거, 계약을 `onSubmit: (images: File[]) => Promise<void>`로. `mission/submit`·`post/create`의 cross-import 4건도 함께 소멸.
     ⚠️ **B3와 섞지 말 것.** `apps/client/CLAUDE.md` 폼 패턴 절에 예외 명기.
  3. `ImageEditorForm` → `widgets/image-editor/`
- **F4 [High]** feature→feature deep import 해소(`calendar`↔`post/list`, `post/detail`↔`like`/`pet/list`/`post/delete`, `post/list`→`post/detail`). 공유 read 훅은 페이지에서 IoC 주입, `LikeButton`/`PostDetailModal`은 상위 레이어에서 조합. **팀 합의 후 별도 PR.**
  - S1이 `calendar → post/list` cross-import 2건을 이미 없앤다.
  - F3-2가 `image-canvas` cross-import 4건을 없앤다 → **F4에서 중복 처리하지 말 것.**
- **F5/F6 [Med]** barrel 없는 12개 슬라이스에 root `index.ts` + deep import ~49건 라우팅. **새 파일 12개 + 약 50파일 수정, 런타임 변화 0.** tsc가 안전망. 별도 PR.
- **F7 [Med]** `like/{add,remove}/api` → `like/api/` 병합. **B2 이후에**(같은 파일).
- **F8 [Low]** P7로 `timeAgo` 삭제 후 `shared/lib/utils.ts` → `cn.ts` 리네임.

---

## Verification

각 Phase 후: `npx tsc --noEmit`(apps/client) + `pnpm --filter client lint`. 삭제 항목은 삭제 전 `grep`으로 참조 0 재확인.

> **스크립트도 CI도 없다** — root/client/server 어디에도 `tsc --noEmit` 스크립트가 없고 `.github/workflows`도 없다. 수동 실행을 PR 체크리스트에 넣을 것.
> **`packages/schemas` 수정 시 `pnpm --filter=@pawboo/schemas build` 필수** (런타임은 dist를 읽는다). 소스에 없는 `dist/feed/` 잔재도 삭제할 것.

**기능 검증**
- **S1**: 위 S1 검증 표 7항목
- **B2**: 탭 즉시 숫자·색 변경 → 서버 응답 후 유지, 실패 시 원복. 좋아요 목록에서 해제 → 항목 사라짐
- **B3/B5**: **일반 게시물 작성**에서 더블탭 → POST 1건. 캡처 중 "저장 중..." 표시. 실패 시 토스트
- **B4**: 반복 생성 후 `chrome://blob-internals`에 blob 누적 없음
- **B6**: 짧은 첫 페이지에서 다음 페이지 로드 + 스켈레톤. **네트워크 끊고 스크롤 → 재요청 폭주 없음**
- **B7/F1**: 만료 토큰 → 리프레시 1회, 실패 시 리다이렉트 1회
- **B8'**: 기기 TZ를 UTC/미국으로 바꿔도 현재 달이 맞는지
- **P3**: tsc + 상세/캘린더 모달에서 슬라이드·도트·좋아요 버튼 위치 이상 없음
- **R3**: 실기 렌더 확인 + `blob.size` 로깅
- **F 전반**: tsc + lint + cross-import grep 0건 + 미션 업로드/게시물 작성 실기 동작

---

## 착수 순서

| 순서 | 내용 | PR |
|---|---|---|
| 0 | **S1 캘린더 전용 집계 API** + 캘린더 클라 전환 (R2 흡수) | PR ⓪ (schemas+server+client, **배포 2단계**) |
| 1 | **Phase 1** — B2·B3+B5·B4·B6·B7+F1·B8' | PR ① (클라 전용) |
| 2 | **Phase 2** — dead code | PR ② |
| 3 | **Phase 3** — R1·R3 | PR ③ |
| 4 | **Phase 4 국소** — F2·F3(F3-2 포함)·F7·F8 | PR ④ |
| 5 | **Phase 4 대규모** — F5/F6 → F4 | PR ⑤·⑥ |

**순서 제약**
- **S1 → B2**: 같은 파일(`patch-like-cache.ts`). S1이 축소하고 B2가 그 위에 올라간다.
- **S1 → P10**: 같은 파일(`calendar/lib/calendar.ts`)에 `toMonthKey`를 추가한다.
- **B4 → R1**: 정리 effect가 먼저 들어가야 R1이 한 곳으로 합친다.
- **B2 → F7**: 같은 파일들.
- **B3 → F3-2**: 버그 수정과 계약 변경을 섞지 않는다.
- **B7 + F1 동시**: 같은 함수.

**현재 브랜치**: `refactor/client-audit`(develop 분기, client 전용 커밋 5개). S1은 3패키지라 별도 브랜치 권장.

## 리스크 노트

- **S1 KST 경계**: 이 작업에서 가장 실수하기 쉬운 유일한 로직. 유닛 2줄 + 실기 1회로 막는다.
- **S1 schemas build**: 빠뜨리면 tsc 통과 후 런타임 즉사.
- **S1 startTransition**: 없으면 월 이동 시 화면 전체가 스켈레톤이 된다(지금보다 나빠지는 유일한 항목).
- **B6 실패 루프**: `isFetchingNextPage`를 가드/deps에 넣으면 오프라인에서 요청 폭주.
- **B8' `toDateKey`**: 통째로 KST화하면 UTC+10 이상 기기에서 모든 타일이 밀린다.
- **R3 캡처**: 실기 렌더 검증(폰트·이미지) 없이 워밍업 제거 금지.
- **P3 캐러셀**: `setApi` effect와 `relative` 래퍼를 지우면 좋아요 버튼·도트가 튄다.
- **F5/F6**: 50여 파일에 런타임 변화 0. 반드시 별도 PR.
- **DB 세션 TimeZone**: UTC 전제가 어긋나면 **에러 없이** 전 날짜가 9시간 밀린다.

---

## Appendix — 검토 후 기각한 대안 (재론 방지)

| 대안 | 기각 사유 |
|---|---|
| **캘린더를 클라 5줄(페치 범위 상한)로만 해결** | 정확성은 고쳐지나 비용이 "오늘로부터의 거리"에 비례하는 구조가 남고, 달력 개수를 늘릴 수 없다. S1이 상수 비용으로 만든다 |
| **캘린더 한 달만 표시** | 축소 근거였던 "데이터 범위 절반"이 S1로 소멸. 화면 단순화만 남는 순수 제품 판단 |
| **`PostQuerySchema`에 `date`/`from`/`to` 추가** | 무인증 `GET /posts`가 같은 스키마를 쓴다. 공개 피드 동작이 요청 없이 바뀐다 |
| **응답 계약 유지 + 월 범위만 추가** | 페이로드가 게시물 밀도에 선형으로 남고, LIMIT을 걸면 지금 고치려는 무성 데이터 누락을 재도입 |
| **`{ pet, days }` pet 루트 승격** | gzip 기준 −54 B. 대표펫 없는 유저 구멍만 새로 생긴다 |
| **`GET /posts/calendar/day?date=` 하루 상세 라우트** | `postIds` + 기존 `/posts/:id`가 서버 0줄로 같은 일을 한다. k>3 실측되면 그때 |
| **`from`/`to` 범위 파라미터** | `month` 단일이면 월 이동 시 절반이 캐시 히트 |
| **`DISTINCT ON`** | `postIds`가 필요해 어차피 집계. GROUP BY 하나로 대표행 3필드 + id 목록을 같이 뽑는 게 짧다 |
| **`timestamptz` 마이그레이션** | drizzle이 이미 UTC 파싱 보장(`timestamp.js:30-36`) |
| **커버링 인덱스(`INCLUDE`)** | `image_urls`가 jsonb라 인덱스가 커지고 write 증폭. 월 단위 수십~수백 행에서 heap fetch는 병목 아님 |
| **`patch-like-cache.ts` 삭제 후 전면 무효화** | like 상태 캐시는 S1 이후 `detail()` 하나뿐. `liked()`는 멤버십이라 다른 문제. 전면 무효화는 refetch만 늘린다 |
| **`api-routes.constants.ts`의 `METHOD:` 제거(P2)** | `.METHOD` 코드 참조는 0건이지만 엔드포인트별 HTTP 메서드 확인용으로 쓰인다. 죽은 코드가 아니라 문서다 |
| **`getNextPageParam` 헬퍼 추출(P9)** | 한 줄 × 3곳 |
| **무한스크롤 공통 훅(B6)** | 사용처 2곳 |
| **`useImagePreview` 훅 신설(B4)** | `shared/hooks`가 존재하지 않고, 3줄 × 3곳에 새 세그먼트를 여는 거래 |
| **refresh 전용 axios 인스턴스(B7)** | SSR 쿠키 인터셉터 재등록 누락이라는 새 실패 모드. `_retry`로 충분 |
| **carousel 파일 통째 삭제** | 소비처가 api 표면을 쓰고 `relative`에 오버레이가 의존. 실기 검증 필요 → 미사용분 제거로 축소 |
| **embla → CSS scroll-snap** | `current`가 인디케이터가 아니라 **삭제·좋아요 대상**을 결정한다. `onScroll` 반올림은 관성 스크롤 중 중간값을 낸다 |
| **`ServerFetchBoundary` 프리페치** | 캘린더 페이지 2개 모두 `'use client'`이고 소비처 0 |

### 범위 밖 (별건으로 다룰 가치 있음)

- **`app.use(compression())`** — `main.ts`에 compression이 없고 의존성도 없다. **2줄로 이 PR 전체보다 큰 절감**이 나온다.
- **`apps/client/CLAUDE.md` 정정** — 실재하지 않는 `shared/hooks`·`shared/store`·`widgets/bottom-nav`·`widgets/pet` 기술.
- **`packages/schemas/dist/feed/` 잔재 삭제** — 소스에 없는 디렉터리가 dist에 남아 있다.
- **`/posts/pets/:petId` 소유권 미검증** — 현재도 `findById`만 쓴다(`findByIdAndUserId`가 있는데도) = 남의 펫 캘린더 공개. S1은 **동작 보존**을 위해 그대로 이관한다. 바꾸려면 제품 결정 필요.
