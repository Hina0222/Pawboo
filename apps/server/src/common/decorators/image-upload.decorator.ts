import {
  applyDecorators,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export const ImageUpload = (fieldName = 'image') =>
  applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: memoryStorage(),
        fileFilter: (_req, file, cb) => {
          const allowed = ['image/jpeg', 'image/png', 'image/webp'];
          if (allowed.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                'JPEG, PNG, WEBP 이미지만 업로드 가능합니다.',
              ),
              false,
            );
          }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
      }),
    ),
  );
