'use client';

import { Send } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useCreateCommentForm } from '../hooks/useCreateCommentForm';

interface CreateCommentFormProps {
  submissionId: number;
}

export function CreateCommentForm({ submissionId }: CreateCommentFormProps) {
  const { methods, onSubmit, isPending } = useCreateCommentForm(submissionId);
  const {
    register,
    watch,
    formState: { errors },
  } = methods;

  const content = watch('content');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5 border-t border-border pt-3">
      <div className="flex items-center gap-2">
        <input
          {...register('content')}
          placeholder="댓글을 입력하세요..."
          maxLength={300}
          disabled={isPending}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon-sm"
          disabled={isPending || !content?.trim()}
        >
          <Send size={16} />
        </Button>
      </div>
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
    </form>
  );
}
