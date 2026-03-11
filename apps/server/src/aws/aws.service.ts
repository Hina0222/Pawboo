import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly cloudfrontUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION')!;
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET')!;
    this.cloudfrontUrl = this.configService.get<string>('AWS_CLOUDFRONT_URL')!;
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async uploadImage(buffer: Buffer, folder: string): Promise<string> {
    let resized: Buffer;
    try {
      resized = await sharp(buffer)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      throw new BadRequestException('이미지 처리에 실패했습니다.');
    }

    const key = `${folder}/${uuidv4()}.webp`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: resized,
          ContentType: 'image/webp',
        }),
      );
    } catch (error) {
      this.logger.error('S3 업로드 실패', error);
      throw new InternalServerErrorException('이미지 업로드에 실패했습니다.');
    }
    return `${this.cloudfrontUrl}/${key}`;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1);

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`S3 이미지 삭제 실패: ${key}`, error);
    }
  }
}
