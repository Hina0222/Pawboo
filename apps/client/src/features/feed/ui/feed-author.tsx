import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import type { FeedItem } from '@bragram/schemas/feed';
import Link from 'next/link';

type FeedAuthorProps = Pick<FeedItem, 'pet' | 'owner' | 'createdAt'>;

export function FeedAuthor({ pet, owner, createdAt }: FeedAuthorProps) {
  return (
    <div className="flex items-center px-5">
      <Link href={`/community/user/${owner.id}`} className="flex items-center gap-2">
        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-muted">
          {pet.imageUrl ? (
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff size={14} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{owner.nickname}</span>
          <span className="text-xs text-muted-foreground">{pet.name}</span>
        </div>
      </Link>
      <span className="ml-auto text-xs text-muted-foreground">
        {new Date(createdAt).toLocaleDateString('ko-KR')}
      </span>
    </div>
  );
}
