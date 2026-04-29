import { useState, useEffect } from 'react';
import { useGetPetPostsSuspenseInfiniteQuery } from '@/features/post/list/api/useGetPetPostsInfiniteQuery';
import { groupPostsByDate } from '../model/calendar';

export function usePetCalendarView(petId: number) {
  const now = new Date();
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );

  const prevMonthDate = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1);

  const { data, hasNextPage, fetchNextPage } = useGetPetPostsSuspenseInfiniteQuery(petId);

  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const postsByDate = groupPostsByDate(data.pages.flatMap(p => p.data));

  function prevMonth() {
    setActiveStartDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function nextMonth() {
    setActiveStartDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  return { activeStartDate, prevMonthDate, postsByDate, prevMonth, nextMonth };
}
