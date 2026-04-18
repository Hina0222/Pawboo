# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Pawboo — pnpm monorepo 기반의 풀스택 웹 애플리케이션.

- `apps/client` — Next.js 16 (App Router, 포트 3001)
- `apps/server` — NestJS 11 (포트 3000)
- `packages/schemas` — 공유 Zod 스키마 (`@pawboo/schemas`)

## 주요 명령어

### 루트 (전체)
```bash
pnpm install          # 의존성 설치
pnpm build            # client + server 빌드
pnpm lint             # client + server lint
pnpm format           # client + server prettier
```

### Client (`apps/client`)
```bash
pnpm --filter=client dev       # 개발 서버 (포트 3001)
pnpm --filter=client build
pnpm --filter=client lint
pnpm --filter=client format
```

### Server (`apps/server`)
```bash
pnpm --filter=server start:dev   # 개발 서버 (watch 모드)
pnpm --filter=server build
pnpm --filter=server test        # Jest 단위 테스트
pnpm --filter=server test:e2e    # E2E 테스트
pnpm --filter=server test:watch  # 단일 테스트 파일 watch
```

### DB (server 디렉토리에서)
```bash
pnpm --filter=server db:generate  # Drizzle 마이그레이션 생성
pnpm --filter=server db:migrate   # 마이그레이션 적용
pnpm --filter=server db:push      # 스키마 직접 push (개발용)
pnpm --filter=server db:studio    # Drizzle Studio UI
```

### Docker (PostgreSQL)
```bash
# apps/server 디렉토리에서 실행
docker compose up -d    # PostgreSQL 컨테이너 시작
docker compose down     # 컨테이너 중지
```

## 아키텍처

### 공유 스키마 패키지 (`packages/schemas`)
- **No-Build 방식**: `.ts` 소스를 빌드 없이 직접 참조
- client와 server 모두 `@pawboo/schemas`를 `workspace:*`로 참조
- `index.ts`에서 re-export 시 `.js` 확장자 사용 (ESM 호환)
- 패키지 루트에 파일 위치 (`src/` 없음): `index.ts`, `user/index.ts` 등

### Client 구조 (`apps/client/src`)
- **FSD(Feature-Sliced Design) 지향 구조** — `app/`, `shared/` 레이어로 구성
- `shared/api/` — axios 인스턴스(`NEXT_PUBLIC_API_URL` 참조), `apiClient` 래퍼, TanStack Query 클라이언트
- `shared/boundary/` — `ServerFetchBoundary` (서버 컴포넌트 prefetch + HydrationBoundary), `withErrorBoundary`, `withSuspense`
- `shared/ui/` — shadcn/ui 기반 컴포넌트 (Tailwind CSS v4)
- `app/providers/` — `QueryProvider` (TanStack Query 전역 설정)

### Server 구조 (`apps/server/src`)
- NestJS 모듈 패턴: 기능별 Module → Controller → Service
- `ConfigModule` — 전역, Zod로 환경 변수 검증 (시작 시 실패 시 예외)
- `DatabaseModule` — 전역, `DRIZZLE_ORM` 심볼로 DI. `@InjectRepository` 대신 `@Inject(DRIZZLE_ORM)` 사용
- DB 스키마: `apps/server/src/database/schema/`에 Drizzle ORM 스키마 정의

### 환경 변수
**Server** (`.env` 파일 필요):
```
PORT=3000
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=pawboo_dev
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pawboo_dev
```

**Client** (`.env.local` 파일 필요):
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 개발 규칙

- **패키지 매니저**: 반드시 `pnpm` 사용 (npm/yarn 금지)
- **새 스키마**: `packages/schemas`에 Zod 스키마 추가 후 `index.ts`에서 `.js` 확장자로 re-export
- **새 서버 기능**: Module → Controller → Service 파일 세트로 생성하고 `AppModule`에 import
- **DB 인젝션**: `@Inject(DRIZZLE_ORM) private db: DrizzleDB` 패턴 사용
- **tsconfig**: client는 `moduleResolution: bundler`, server는 `moduleResolution: nodenext`
