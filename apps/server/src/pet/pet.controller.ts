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
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetService } from './pet.service';
import { ImageUpload } from '../common/decorators/image-upload.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import {
  CreatePetSchema,
  UpdatePetSchema,
  PetResponse,
} from '@pawboo/schemas/pet';

@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @ImageUpload()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: Record<string, string>,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PetResponse> {
    const parsed = CreatePetSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }

    return this.petService.create(req.user.id, parsed.data, file?.buffer);
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
  @ImageUpload()
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
