import { BackHeader } from '@/widgets/header';
import { UserProfile } from '@/features/user/profile/ui';
import { UserFeedGrid } from '@/features/feed/user-feed/ui';
import { BottomNav } from '@/widgets/bottom-nav';
import { UserPetList } from '@/widgets/pet';
import { ServerFetchBoundary } from '@/shared/boundary/server-fetch-boundary';
import { getUserProfileQueryOptions } from '@/features/user/profile/api/useGetUserProfileQuery';
import { getUserFeedsInfiniteQueryOptions } from '@/features/feed/user-feed/api/useGetUserFeedsInfiniteQuery';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <div className="pb-20">
      <BackHeader title="프로필" />
      <ServerFetchBoundary
        queryOptions={[
          getUserProfileQueryOptions(userId),
          getUserFeedsInfiniteQueryOptions(userId),
        ]}
      >
        <UserProfile userId={userId} />

        <section className="px-5 pb-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">반려동물</h2>
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
            <UserPetList userId={userId} />
          </div>
        </section>

        <div className="border-t border-border">
          <UserFeedGrid userId={userId} />
        </div>
      </ServerFetchBoundary>
      <BottomNav />
    </div>
  );
}
