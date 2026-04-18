import { z } from 'zod';
import { CreateSubmissionSchema } from '@pawboo/schemas/mission';

export const SubmitMissionFormSchema = CreateSubmissionSchema.extend({
  images: z
    .array(z.instanceof(File))
    .min(1, '이미지를 1장 이상 업로드해주세요.')
    .max(5, '이미지는 최대 5장까지 업로드 가능합니다.'),
  hashtags: z.array(z.string()).max(5, '해시태그는 최대 5개까지 입력할 수 있습니다').optional(),
});

export type SubmitMissionFormValues = z.infer<typeof SubmitMissionFormSchema>;
