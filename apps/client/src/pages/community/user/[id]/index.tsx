import { BackHeader } from '@/widgets/header';
import { UserPetScroll, UserProfile } from '@/features/user/profile/ui';
import { UserFeedGrid } from '@/features/feed/user-feed/ui';
import { BottomNav } from '@/widgets/bottom-nav';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <div className="pb-20">
      <BackHeader title="프로필" />
      <UserProfile userId={userId} />
      <UserPetScroll userId={userId} />
      <div className="border-t border-border">
        <UserFeedGrid userId={userId} />
      </div>
      <BottomNav />
    </div>
  );
}
