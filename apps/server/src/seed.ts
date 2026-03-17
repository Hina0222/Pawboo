import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { like, sql } from 'drizzle-orm';
import * as schema from './database/schema';

const { users, pets, missionSubmissions, follows, likes, comments } = schema;

// ── 상수 ──────────────────────────────────────────────────────────────────────

const IMAGE_URLS = [
  'https://d1offgw1o9qvkm.cloudfront.net/missions/5b46e1fb-ba39-49df-b212-fb6711d0549f.webp',
  'https://d1offgw1o9qvkm.cloudfront.net/missions/e94b64bc-1232-4c1c-be3e-e50d68b6f509.webp',
  'https://d1offgw1o9qvkm.cloudfront.net/missions/3b416354-71ca-4c65-bca7-f17c9cf6fc77.webp',
  'https://d1offgw1o9qvkm.cloudfront.net/missions/33d4ede3-698e-4c1f-967d-cef1c5d30059.webp',
];

const MISSION_IDS = [1, 2, 3, 4, 5, 6, 7];

const SURNAMES = [
  '김',
  '이',
  '박',
  '최',
  '정',
  '강',
  '조',
  '윤',
  '장',
  '임',
  '한',
  '오',
  '서',
  '신',
  '권',
];
const GIVEN_NAMES = [
  '민준',
  '서연',
  '지우',
  '하은',
  '준서',
  '수아',
  '도현',
  '지민',
  '예린',
  '태양',
  '민서',
  '지원',
  '유나',
  '현우',
  '채원',
  '시우',
  '다은',
  '재원',
  '나은',
  '준혁',
  '소은',
  '민재',
  '지호',
  '예원',
  '수빈',
  '하준',
  '윤서',
  '지안',
  '은우',
  '서진',
];

const PET_NAMES = [
  '코코',
  '몽이',
  '초코',
  '루나',
  '별이',
  '복실',
  '해피',
  '뭉이',
  '두부',
  '감자',
  '토토',
  '맥스',
  '체리',
  '레오',
  '모모',
  '바둑이',
  '흰둥이',
  '점박이',
  '호두',
  '쿠키',
  '망고',
  '솜이',
  '구름',
  '하늘',
  '봄이',
  '눈이',
  '사탕',
  '콩이',
  '버터',
  '크림',
  '단비',
  '비비',
  '포도',
  '밀크',
  '카라',
  '아리',
  '뽀삐',
  '몰리',
  '럭키',
  '타이거',
];

const PET_COMMENTS = [
  '오늘도 최선을 다했어요!',
  '우리 아이 너무 귀여워요',
  '미션 완료!',
  '열심히 했어요 😊',
  '매일 이렇게 하면 좋겠다',
  '잘 따라줬어요',
  '신나게 했어요!',
  '힘들었지만 해냈어요',
  '오늘도 건강하게!',
  '우리 아이 최고!',
  '다음에도 도전!',
  '재미있었어요',
];

const COMMENT_CONTENTS = [
  '귀엽다!',
  '완전 귀여워요 💕',
  '우리 댕댕이랑 닮았어요',
  '미션 성공!',
  '대단해요~',
  '정말 열심히 하는 펫이네요',
  '산책 잘 했네요!',
  '부지런한 아이네요',
  '너무 귀여워요',
  '오늘도 화이팅!',
  '빠르다~',
  '달리기 잘한다!',
  '사진 잘 나왔어요',
  '멋있어요!',
  '응원해요!',
  '최고예요 👏',
  '사랑스럽다',
  '잘했어요~',
  '대단한 펫이네요',
  '존귀해',
];

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function pick<T>(arr: T[], idx: number): T {
  return arr[Math.abs(idx) % arr.length];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not defined');

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  console.log('🌱 Seeding started (large dataset)...');

  // ── 1. 유저 INSERT (ON CONFLICT DO NOTHING → 이미 있으면 스킵) ─────────────
  console.log('👤 Inserting 100 users...');
  const userValues = Array.from({ length: 100 }, (_, i) => ({
    kakaoId: `test_kakao_${i + 5}`,
    nickname: `${pick(SURNAMES, i)}${pick(GIVEN_NAMES, i * 3 + 1)}`,
  }));

  await db.insert(users).values(userValues).onConflictDoNothing();

  // kakaoId로 재조회해서 실제 id 확보
  const insertedUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(like(users.kakaoId, 'test_kakao_%'));

  const userIds = insertedUsers.map((u) => u.id).sort((a, b) => a - b);
  console.log(
    `  ✅ ${userIds.length}명 확인 (id ${userIds[0]} ~ ${userIds[userIds.length - 1]})`,
  );

  // ── 2. 펫 INSERT (userId당 이미 펫이 있으면 스킵) ─────────────────────────
  console.log('🐾 Inserting pets (2~3 per user)...');

  // 이미 펫이 있는 userId 집합
  const existingPets = await db.select({ userId: pets.userId }).from(pets)
    .where(sql`${pets.userId} = ANY(
    ${sql.raw(`ARRAY[${userIds.join(',')}]::int[]`)}
    )`);
  const existingPetUserIds = new Set(existingPets.map((p) => p.userId));

  const petValues: {
    userId: number;
    name: string;
    type: 'dog' | 'cat';
    isActive: boolean;
  }[] = [];
  userIds.forEach((userId, ui) => {
    if (existingPetUserIds.has(userId)) return; // 이미 있음
    const count = ui % 3 === 0 ? 3 : 2;
    for (let p = 0; p < count; p++) {
      petValues.push({
        userId,
        name: pick(PET_NAMES, ui * 3 + p),
        type: (ui + p) % 2 === 0 ? 'dog' : 'cat',
        isActive: true,
      });
    }
  });

  if (petValues.length > 0) {
    await db.insert(pets).values(petValues);
  }

  // 실제 펫 목록 재조회
  const insertedPets = await db
    .select({ id: pets.id, userId: pets.userId })
    .from(pets).where(sql`${pets.userId} = ANY(
    ${sql.raw(`ARRAY[${userIds.join(',')}]::int[]`)}
    )`);

  console.log(`  ✅ ${insertedPets.length}마리 확인`);

  // ── 3. 미션 제출 INSERT (ON CONFLICT DO NOTHING) ───────────────────────────
  console.log('📸 Inserting mission submissions (5~6 per pet)...');

  const submissionValues: {
    missionId: number;
    petId: number;
    imageUrl: string;
    comment: string;
  }[] = [];

  insertedPets.forEach((pet, pi) => {
    const missionCount = pi % 2 === 0 ? 5 : 6;
    const shuffledMissions = shuffle(MISSION_IDS, pi * 31 + pet.id);
    shuffledMissions.slice(0, missionCount).forEach((missionId, mi) => {
      submissionValues.push({
        missionId,
        petId: pet.id,
        imageUrl: IMAGE_URLS[(pi + mi) % IMAGE_URLS.length],
        comment: pick(PET_COMMENTS, pi + mi),
      });
    });
  });

  let insertedSubCount = 0;
  for (const batch of chunks(submissionValues, 500)) {
    const result = await db
      .insert(missionSubmissions)
      .values(batch)
      .onConflictDoNothing()
      .returning({ id: missionSubmissions.id });
    insertedSubCount += result.length;
  }

  // 전체 submission id 재조회
  const allSubs = await db
    .select({ id: missionSubmissions.id })
    .from(missionSubmissions)
    .where(
      sql`${missionSubmissions.petId} = ANY(
      ${sql.raw(`ARRAY[${insertedPets.map((p) => p.id).join(',')}]::int[]`)}
      )`,
    );
  const allSubIds = allSubs.map((s) => s.id);
  console.log(
    `  ✅ 총 ${allSubIds.length}개 제출 확인 (신규 ${insertedSubCount}개)`,
  );

  // ── 4. 팔로우 INSERT (ON CONFLICT DO NOTHING) ─────────────────────────────
  console.log('👥 Inserting follows...');
  const allUserIds = [1, 2, 3, 4, ...userIds];
  const followSet = new Set<string>();
  const followValues: { followerId: number; followingId: number }[] = [];

  allUserIds.forEach((followerId, fi) => {
    const followCount = 5 + (fi % 6);
    const candidates = shuffle(allUserIds, fi * 7777).filter(
      (id) => id !== followerId,
    );
    candidates.slice(0, followCount).forEach((followingId) => {
      const key = `${followerId}:${followingId}`;
      if (!followSet.has(key)) {
        followSet.add(key);
        followValues.push({ followerId, followingId });
      }
    });
  });

  for (const batch of chunks(followValues, 500)) {
    await db.insert(follows).values(batch).onConflictDoNothing();
  }
  console.log(`  ✅ ${followValues.length}개 팔로우 삽입 시도`);

  // ── 5. 좋아요 INSERT (ON CONFLICT DO NOTHING) ─────────────────────────────
  console.log('❤️  Inserting likes...');
  const likeSet = new Set<string>();
  const likeValues: { submissionId: number; userId: number }[] = [];

  allUserIds.forEach((userId, ui) => {
    const shuffledSubs = shuffle(allSubIds, ui * 1234);
    const likeCount = Math.floor(allSubIds.length * 0.3);
    shuffledSubs.slice(0, likeCount).forEach((submissionId) => {
      const key = `${submissionId}:${userId}`;
      if (!likeSet.has(key)) {
        likeSet.add(key);
        likeValues.push({ submissionId, userId });
      }
    });
  });

  for (const batch of chunks(likeValues, 1000)) {
    await db.insert(likes).values(batch).onConflictDoNothing();
  }
  console.log(`  ✅ ${likeValues.length}개 좋아요 삽입 시도`);

  // ── 6. 댓글 INSERT (중복 방지: submission+user 조합 체크) ──────────────────
  console.log('💬 Inserting comments...');

  // 이미 있는 댓글 조회
  const existingComments = await db
    .select({ submissionId: comments.submissionId, userId: comments.userId })
    .from(comments)
    .where(
      sql`${comments.submissionId} = ANY(
      ${sql.raw(`ARRAY[${allSubIds.join(',')}]::int[]`)}
      )`,
    );
  const existingCommentSet = new Set(
    existingComments.map((c) => `${c.submissionId}:${c.userId}`),
  );

  const commentValues: {
    submissionId: number;
    userId: number;
    content: string;
  }[] = [];
  allUserIds.forEach((userId, ui) => {
    const shuffledSubs = shuffle(allSubIds, ui * 5678 + 99);
    const commentCount = Math.floor(allSubIds.length * 0.08);
    shuffledSubs.slice(0, commentCount).forEach((submissionId, ci) => {
      const key = `${submissionId}:${userId}`;
      if (!existingCommentSet.has(key)) {
        existingCommentSet.add(key);
        commentValues.push({
          submissionId,
          userId,
          content: pick(COMMENT_CONTENTS, ui + ci),
        });
      }
    });
  });

  for (const batch of chunks(commentValues, 1000)) {
    await db.insert(comments).values(batch);
  }
  console.log(`  ✅ ${commentValues.length}개 댓글 삽입`);

  // ── 7. 카운트 일괄 업데이트 (서브쿼리 방식) ───────────────────────────────
  console.log('🔢 Updating counts...');

  await db.execute(sql`
      UPDATE mission_submissions
      SET like_count = (SELECT COUNT(*) FROM likes WHERE likes.submission_id = mission_submissions.id)
  `);

  await db.execute(sql`
      UPDATE mission_submissions
      SET comment_count = (SELECT COUNT(*) FROM comments WHERE comments.submission_id = mission_submissions.id)
  `);

  await db.execute(sql`
      UPDATE users
      SET follower_count  = (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id),
          following_count = (SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id)
  `);

  console.log('  ✅ All counts updated');

  await client.end();
  console.log('✅ Seeding completed!');
  console.log(
    `   users: ${userIds.length}명 | pets: ${insertedPets.length}마리 | submissions: ${allSubIds.length}개`,
  );
  console.log(
    `   follows: ${followValues.length}개 | likes: ${likeValues.length}개 | comments: ${commentValues.length}개`,
  );
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
