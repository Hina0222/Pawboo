import {z} from 'zod';

export const ReportReasonSchema = z.enum(['inappropriate', 'spam', 'copyright']);

export const CreateReportSchema = z.object({
  reason: ReportReasonSchema,
});

export type ReportReason = z.infer<typeof ReportReasonSchema>;
export type CreateReportRequest = z.infer<typeof CreateReportSchema>;