'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { withErrorBoundary, withSuspense } from '@/shared/boundary';
import PostDetailModal from '@/features/post/detail/ui/post-detail-modal';
import { useCalendarView } from '../hooks/useCalendarView';
import { usePetCalendarView } from '../hooks/usePetCalendarView';
import { toDateKey, formatYear, formatMonth } from '../lib/calendar';
import { CalendarViewSkeleton } from './calendar-view-skeleton';
import { CalendarViewError } from './calendar-view-error';
import { CalendarTile } from './calendar-tile';
import type { PostItem } from '@pawboo/schemas/post';
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

interface CalendarViewContentProps {
  activeStartDate: Date;
  prevMonthDate: Date;
  postsByDate: Record<string, PostItem>;
  prevMonth: () => void;
  nextMonth: () => void;
}

function CalendarViewContent({
  activeStartDate,
  prevMonthDate,
  postsByDate,
  prevMonth,
  nextMonth,
}: CalendarViewContentProps) {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const tileContent = ({ date, view }: { date: Date; view: string }) =>
    view === 'month' ? <CalendarTile date={date} post={postsByDate[toDateKey(date)]} /> : null;

  const handleClickDay = (date: Date) => {
    const post = postsByDate[toDateKey(date)];
    if (post) setSelectedPostId(post.id);
  };

  return (
    <>
      <div className="px-4 select-none">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#E1E1E3]">{formatYear(activeStartDate)}</h2>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="rounded-md p-1 transition-colors hover:bg-muted">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button onClick={nextMonth} className="rounded-md p-1 transition-colors hover:bg-muted">
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
        <div className="space-y-7">
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
      {selectedPostId !== null && (
        <PostDetailModal id={selectedPostId} open={true} onClose={() => setSelectedPostId(null)} />
      )}
    </>
  );
}

function MyCalendarViewInner() {
  const hookData = useCalendarView();
  return <CalendarViewContent {...hookData} />;
}

function PetCalendarViewInner({ petId }: { petId: number }) {
  const hookData = usePetCalendarView(petId);
  return <CalendarViewContent {...hookData} />;
}

function CalendarView({ petId }: { petId?: number }) {
  if (petId !== undefined) return <PetCalendarViewInner petId={petId} />;
  return <MyCalendarViewInner />;
}

export default withErrorBoundary(
  withSuspense(CalendarView, <CalendarViewSkeleton />),
  CalendarViewError
);
