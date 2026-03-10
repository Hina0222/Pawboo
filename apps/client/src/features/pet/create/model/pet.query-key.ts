export const petQueryKeys = {
  all: ['pets'] as const,
  details: () => [...petQueryKeys.all, 'detail'] as const,

  detail: (petId: number) => [...petQueryKeys.details(), petId] as const,
};
