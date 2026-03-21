import { ReactNode } from 'react';
import { connection } from 'next/server';
import { getQueryClient } from '@/shared/api';
import { dehydrate, FetchQueryOptions, HydrationBoundary } from '@tanstack/react-query';

export type FetchOptions = Pick<FetchQueryOptions, 'queryKey' | 'queryFn'>;

interface ServerFetchBoundaryProps {
  children: ReactNode;
  queryOptions?: FetchOptions | FetchOptions[];
}

export const ServerFetchBoundary = async ({ children, queryOptions }: ServerFetchBoundaryProps) => {
  await connection();
  const queryClient = getQueryClient();

  const queries = queryOptions ? (Array.isArray(queryOptions) ? queryOptions : [queryOptions]) : [];

  queries.forEach(opt => {
    queryClient.prefetchQuery(opt);
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};
