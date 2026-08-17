import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import type { PetResponse, PetSearchResponse } from '@pawboo/schemas/pet';

jest.mock('../aws/aws.service', () => ({
  AwsService: jest.fn(),
  IMAGE_PRESET: { PET_THUMBNAIL: 'pet-thumbnail' },
}));

const req = { user: { id: 1 } } as AuthenticatedRequest;

const mockPetResponse: PetResponse = {
  id: 1,
  userId: 1,
  name: '뽀삐',
  imageUrl: 'https://example.com/pet.jpg',
  isRepresentative: true,
  createdAt: new Date(),
};

const mockSearchResponse: PetSearchResponse = {
  data: [{ id: 1, name: '뽀삐', imageUrl: 'https://example.com/pet.jpg' }],
  hasNext: false,
  cursor: null,
};

describe('PetController', () => {
  let controller: PetController;
  let service: jest.Mocked<PetService>;

  const mockPetService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    setRepresentative: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetController],
      providers: [{ provide: PetService, useValue: mockPetService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PetController>(PetController);
    service = module.get<jest.Mocked<PetService>>(PetService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('유효한 body + 파일로 펫 생성', async () => {
      service.create.mockResolvedValue(mockPetResponse);
      const file = { buffer: Buffer.from('img') } as Express.Multer.File;

      const result = await controller.create(req, { name: '뽀삐' }, file);

      expect(service.create).toHaveBeenCalledWith(
        1,
        { name: '뽀삐' },
        file.buffer,
      );
      expect(result).toEqual(mockPetResponse);
    });

    it('파일 없이 펫 생성', async () => {
      service.create.mockResolvedValue(mockPetResponse);

      await controller.create(req, { name: '뽀삐' }, undefined);

      expect(service.create).toHaveBeenCalledWith(
        1,
        { name: '뽀삐' },
        undefined,
      );
    });

    it('name 누락 - BadRequestException', async () => {
      await expect(controller.create(req, {}, undefined)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).not.toHaveBeenCalled();
    });

    it('name이 1자 - BadRequestException', async () => {
      await expect(
        controller.create(req, { name: '뽀' }, undefined),
      ).rejects.toThrow(BadRequestException);
      expect(service.create).not.toHaveBeenCalled();
    });

    it('공백만 있는 name - BadRequestException (trim 후 빈 문자열)', async () => {
      await expect(
        controller.create(req, { name: '   ' }, undefined),
      ).rejects.toThrow(BadRequestException);
      expect(service.create).not.toHaveBeenCalled();
    });

    it('name이 16자 - BadRequestException', async () => {
      await expect(
        controller.create(req, { name: 'a'.repeat(16) }, undefined),
      ).rejects.toThrow(BadRequestException);
      expect(service.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('내 펫 목록 조회', async () => {
      service.findAllByUser.mockResolvedValue([mockPetResponse]);

      const result = await controller.findAll(req);

      expect(service.findAllByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockPetResponse]);
    });
  });

  describe('searchPets', () => {
    it('유효한 검색어로 검색', async () => {
      service.search.mockResolvedValue(mockSearchResponse);

      const result = await controller.searchPets({ q: '뽀삐' });

      expect(service.search).toHaveBeenCalledWith({ q: '뽀삐', limit: 20 });
      expect(result).toEqual(mockSearchResponse);
    });

    it('cursor와 limit 포함 검색', async () => {
      service.search.mockResolvedValue(mockSearchResponse);

      await controller.searchPets({ q: '뽀삐', cursor: '10', limit: '5' });

      expect(service.search).toHaveBeenCalledWith({
        q: '뽀삐',
        cursor: 10,
        limit: 5,
      });
    });

    it('검색어 누락 - BadRequestException', () => {
      expect(() => controller.searchPets({})).toThrow(BadRequestException);
      expect(service.search).not.toHaveBeenCalled();
    });

    it('빈 검색어 - BadRequestException', () => {
      expect(() => controller.searchPets({ q: '' })).toThrow(
        BadRequestException,
      );
      expect(service.search).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('특정 펫 조회', async () => {
      service.findOneById.mockResolvedValue(mockPetResponse);

      const result = await controller.findOne(1);

      expect(service.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPetResponse);
    });
  });

  describe('update', () => {
    it('이름과 파일로 펫 수정', async () => {
      service.update.mockResolvedValue(mockPetResponse);
      const file = { buffer: Buffer.from('img') } as Express.Multer.File;

      const result = await controller.update(req, 1, { name: '코코' }, file);

      expect(service.update).toHaveBeenCalledWith(
        1,
        1,
        { name: '코코' },
        file.buffer,
      );
      expect(result).toEqual(mockPetResponse);
    });

    it('빈 body로 수정 (이름 변경 없음)', async () => {
      service.update.mockResolvedValue(mockPetResponse);

      await controller.update(req, 1, {}, undefined);

      expect(service.update).toHaveBeenCalledWith(1, 1, {}, undefined);
    });

    it('name이 1자 - BadRequestException', async () => {
      await expect(
        controller.update(req, 1, { name: '뽀' }, undefined),
      ).rejects.toThrow(BadRequestException);
      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('펫 삭제', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(req, 1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('setRepresentative', () => {
    it('대표펫 설정', async () => {
      service.setRepresentative.mockResolvedValue(mockPetResponse);

      const result = await controller.setRepresentative(req, 1);

      expect(service.setRepresentative).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockPetResponse);
    });
  });
});
