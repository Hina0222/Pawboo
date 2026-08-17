import { useState, useTransition } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { calendarMonthQueryOptions } from '../api/useCalendarMonthQuery';
import { toMonthKey } from '../lib/calendar';
import type { CalendarDay } from '@pawboo/schemas/post';

export function useCalendarMonths(petId?: number) {
  const [activeStartDate, setActiveStartDate] = useState<Date>(() => {
    // 서버 버킷이 KST 기준이므로 "현재 달"도 KST로 — 기기 로컬 TZ와 무관하게 일치
    const [y, m] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' })
      .format(new Date())
      .split('-')
      .map(Number);
    return new Date(y, m - 1, 1);
  });
  // startTransition 필수 — 없으면 월 이동 시 useSuspenseQueries가 서스펜드해서
  // withSuspense가 화면 전체를 스켈레톤으로 갈아끼운다.
  const [isPending, startTransition] = useTransition();

  const prevMonthDate = new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1);

  const [activeMonth, prevMonth] = useSuspenseQueries({
    queries: [
      calendarMonthQueryOptions(toMonthKey(activeStartDate), petId),
      calendarMonthQueryOptions(toMonthKey(prevMonthDate), petId),
    ],
  });

  const daysByDate: Record<string, CalendarDay> = Object.fromEntries(
    [...activeMonth.data, ...prevMonth.data].map(day => [day.date, day])
  );

  const shift = (n: number) =>
    startTransition(() => setActiveStartDate(d => new Date(d.getFullYear(), d.getMonth() + n, 1)));

  return {
    activeStartDate,
    prevMonthDate,
    daysByDate,
    isPending,
    prevMonth: () => shift(-1),
    nextMonth: () => shift(1),
  };
}
