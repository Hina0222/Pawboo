import {
  applyDecorators,
  BadRequestException,
  Injectable,
  PipeTransform,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: (err: Error | null, acceptFile: boolean) => void,
) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException('JPEG, PNG, WEBP 이미지만 업로드 가능합니다.'),
      false,
    );
  }
};

export const ImageUpload = (fieldName = 'image') =>
  applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: memoryStorage(),
        fileFilter: imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
      }),
    ),
  );

export const ImagesUpload = (fieldName = 'images', maxCount = 5) =>
  applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount, {
        storage: memoryStorage(),
        fileFilter: imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
      }),
    ),
  );

@Injectable()
export class ImagesValidationPipe implements PipeTransform<
  Express.Multer.File[] | undefined,
  Express.Multer.File[]
> {
  constructor(private readonly options: { min?: number; max?: number } = {}) {}

  transform(files: Express.Multer.File[] | undefined): Express.Multer.File[] {
    const min = this.options.min ?? 1;
    const max = this.options.max ?? 5;
    const count = files?.length ?? 0;

    if (count < min) {
      throw new BadRequestException(`이미지를 ${min}장 이상 업로드해주세요.`);
    }
    if (count > max) {
      throw new BadRequestException(
        `이미지는 최대 ${max}장까지 업로드 가능합니다.`,
      );
    }
    return files as Express.Multer.File[];
  }
}
