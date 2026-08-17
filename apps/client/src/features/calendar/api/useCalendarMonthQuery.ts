import { postQueryKeys } from '@/entities/post/model/post.query-key';
import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/api-routes.constants';
import type { CalendarMonthResponse } from '@pawboo/schemas/post';

export const calendarMonthQueryOptions = (month: string, petId?: number) => ({
  queryKey: postQueryKeys.calendarMonth(month, petId),
  queryFn: (): Promise<CalendarMonthResponse> =>
    apiClient.get<CalendarMonthResponse>(API_ROUTES.POSTS.GET_CALENDAR.URL, {
      params: { month, petId },
    }),
});
