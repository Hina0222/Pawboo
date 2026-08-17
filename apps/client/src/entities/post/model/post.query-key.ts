import type { PostQuery } from '@pawboo/schemas/post';

export const postQueryKeys = {
  all: ['posts'] as const,
  list: (params?: Pick<PostQuery, 'missionId'>) => [...postQueryKeys.all, params] as const,
  details: () => [...postQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
  calendar: () => [...postQueryKeys.all, 'calendar'] as const,
  calendarMonth: (month: string, petId?: number) =>
    [...postQueryKeys.calendar(), petId ?? 'me', month] as const,
  liked: () => [...postQueryKeys.all, 'liked'] as const,
};
