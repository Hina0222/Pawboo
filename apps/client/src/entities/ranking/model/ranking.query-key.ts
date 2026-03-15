import type { RankingQuery } from '@bragram/schemas/ranking';

export const rankingQueryKeys = {
  all: ['rankings'] as const,
  list: (type: RankingQuery['type']) => [...rankingQueryKeys.all, type] as const,
};
