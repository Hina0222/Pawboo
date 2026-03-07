import { ReactNode } from 'react';
import { getQueryClient } from '@/shared/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface ServerFetchBoundaryProps {
  children: ReactNode;
  prefetch: (queryClient: QueryClient) => void;
}

export const ServerFetchBoundary = ({ children, prefetch }: ServerFetchBoundaryProps) => {
  const queryClient = getQueryClient();

  prefetch(queryClient);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};
