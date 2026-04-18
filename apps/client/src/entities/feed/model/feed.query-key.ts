import type { FeedQuery } from '@pawboo/schemas/feed';

export const feedQueryKeys = {
  all: ['feeds'] as const,
  list: (params?: Pick<FeedQuery, 'sort'>) => [...feedQueryKeys.all, params] as const,
  details: () => [...feedQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...feedQueryKeys.details(), id] as const,
};
