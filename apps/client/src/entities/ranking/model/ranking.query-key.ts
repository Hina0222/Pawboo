import type { RankingQuery } from '@pawboo/schemas/ranking';

export const rankingQueryKeys = {
  all: ['rankings'] as const,
  list: (type: RankingQuery['type']) => [...rankingQueryKeys.all, type] as const,
};
