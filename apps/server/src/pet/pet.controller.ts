import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetService } from './pet.service';
import {
  CreatePetSchema,
  UpdatePetSchema,
  PetResponse,
} from '@bragram/schemas/pet';

interface AuthenticatedRequest extends Request {
  user: { id: number; kakaoId: string };
}

const imageUploadOptions = {
  storage: memoryStorage(),
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
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
  },
  limits: { fileSize: 10 * 1024 * 1024 },
};

@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: Record<string, string>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PetResponse> {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }

    const parsed = CreatePetSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    return this.petService.create(req.user.id, parsed.data, file.buffer);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest): Promise<PetResponse[]> {
    return this.petService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PetResponse> {
    return this.petService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, string>,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PetResponse> {
    const parsed = UpdatePetSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    return this.petService.update(req.user.id, id, parsed.data, file?.buffer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.petService.remove(req.user.id, id);
  }

  @Patch(':id/activate')
  activate(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PetResponse> {
    return this.petService.activate(req.user.id, id);
  }
}
