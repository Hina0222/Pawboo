'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import { cn } from '@/shared/lib/utils';
import CalendarPostDetailModal from './calendar-post-detail-modal';
import { useCalendarMonths } from '../hooks/useCalendarMonths';
import { toDateKey, formatYear, formatMonth } from '../lib/calendar';
import { CalendarViewSkeleton } from './calendar-view-skeleton';
import { CalendarViewError } from './calendar-view-error';
import { CalendarTile } from './calendar-tile';
import './calendar.css';

const CALENDAR_BASE_PROPS = {
  formatDay: () => '',
  formatShortWeekday: (_: string | undefined, date: Date) =>
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
  showNavigation: false as const,
  showNeighboringMonth: false,
  locale: 'ko-KR',
  calendarType: 'gregory' as const,
  className: 'custom-calendar',
};

function CalendarView({ petId }: { petId?: number }) {
  const { activeStartDate, prevMonthDate, daysByDate, isPending, prevMonth, nextMonth } =
    useCalendarMonths(petId);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const selectedDay = selectedDateKey ? daysByDate[selectedDateKey] : undefined;

  const tileContent = ({ date, view }: { date: Date; view: string }) =>
    view === 'month' ? <CalendarTile date={date} day={daysByDate[toDateKey(date)]} /> : null;

  const handleClickDay = (date: Date) => {
    const key = toDateKey(date);
    if (daysByDate[key]) {
      setSelectedDateKey(key);
    }
  };

  return (
    <>
      <div className="px-4 select-none">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#E1E1E3]">{formatYear(activeStartDate)}</h2>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="hover:bg-muted rounded-md p-1 transition-colors">
              <ChevronLeft className="text-foreground h-5 w-5" />
            </button>
            <button onClick={nextMonth} className="hover:bg-muted rounded-md p-1 transition-colors">
              <ChevronRight className="text-foreground h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={cn('space-y-7', isPending && 'opacity-60')}>
          <div>
            <h3 className="mb-4 text-xl font-semibold text-[#E1E1E3]">
              {formatMonth(activeStartDate)}
            </h3>
            <Calendar
              activeStartDate={activeStartDate}
              tileContent={tileContent}
              onClickDay={handleClickDay}
              {...CALENDAR_BASE_PROPS}
            />
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold text-[#E1E1E3]">
              {formatMonth(prevMonthDate)}
            </h3>
            <Calendar
              activeStartDate={prevMonthDate}
              tileContent={tileContent}
              onClickDay={handleClickDay}
              {...CALENDAR_BASE_PROPS}
            />
          </div>
        </div>
      </div>
      {selectedDay ? (
        <CalendarPostDetailModal
          postIds={selectedDay.postIds}
          open
          onClose={() => setSelectedDateKey(null)}
        />
      ) : null}
    </>
  );
}

export default withErrorBoundary(
  withSuspense(CalendarView, <CalendarViewSkeleton />),
  CalendarViewError
);
