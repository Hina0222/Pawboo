'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/shared/ui';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface ShareButtonProps {
  feedId: number;
}

export function ShareButton({ feedId }: ShareButtonProps) {
  const t = useTranslations('feed');
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/feed/${feedId}`);
      toast.success(t('linkCopied'));
    } catch {
      toast.error(t('linkCopyFailed'));
    }
  };

  return (
    <Button variant="ghost" size="xs" onClick={handleCopyLink} className="gap-1.5 px-2">
      <Share2 size={16} />
    </Button>
  );
}
