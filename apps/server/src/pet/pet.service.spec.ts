import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetRepository } from './pet.repository';
import { AwsService } from '../aws/aws.service';
import type { PetResponse, PetSearchResponse } from '@pawboo/schemas/pet';

jest.mock('../aws/aws.service', () => ({
  AwsService: jest.fn(),
  IMAGE_PRESET: { PET_THUMBNAIL: 'pet-thumbnail' },
}));

const makePet = (override: Partial<PetResponse> = {}): PetResponse => ({
  id: 1,
  userId: 1,
  name: '뽀삐',
  imageUrl: 'https://example.com/pet.jpg',
  isRepresentative: false,
  createdAt: new Date(),
  ...override,
});

describe('PetService', () => {
  let service: PetService;
  let petRepository: jest.Mocked<PetRepository>;
  let awsService: jest.Mocked<AwsService>;

  const mockPetRepository = {
    findAllByUserId: jest.fn(),
    findById: jest.fn(),
    findByIdAndUserId: jest.fn(),
    findRepresentativeByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    setRepresentative: jest.fn(),
    searchByName: jest.fn(),
    countByUserId: jest.fn(),
  };

  const mockAwsService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetService,
        { provide: PetRepository, useValue: mockPetRepository },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();

    service = module.get<PetService>(PetService);
    petRepository = module.get<jest.Mocked<PetRepository>>(PetRepository);
    awsService = module.get<jest.Mocked<AwsService>>(AwsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('첫 펫 등록 시 isRepresentative: true', async () => {
      petRepository.findAllByUserId.mockResolvedValue([]);
      awsService.uploadImage.mockResolvedValue('https://example.com/pet.jpg');
      petRepository.create.mockResolvedValue(
        makePet({ isRepresentative: true }),
      );

      await service.create(1, { name: '뽀삐' }, Buffer.from('img'));

      expect(petRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ isRepresentative: true }),
      );
    });

    it('두 번째 펫 등록 시 isRepresentative: false', async () => {
      petRepository.findAllByUserId.mockResolvedValue([makePet()]);
      awsService.uploadImage.mockResolvedValue('https://example.com/pet.jpg');
      petRepository.create.mockResolvedValue(makePet({ id: 2 }));

      await service.create(1, { name: '코코' }, Buffer.from('img'));

      expect(petRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ isRepresentative: false }),
      );
    });

    it('이미지 없이 생성 - imageUrl: null, uploadImage 미호출', async () => {
      petRepository.findAllByUserId.mockResolvedValue([]);
      petRepository.create.mockResolvedValue(makePet({ imageUrl: null }));

      await service.create(1, { name: '뽀삐' }, undefined);

      expect(awsService.uploadImage).not.toHaveBeenCalled();
      expect(petRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ imageUrl: null }),
      );
    });

    it('펫 5마리 초과 - BadRequestException', async () => {
      petRepository.findAllByUserId.mockResolvedValue(
        Array.from({ length: 5 }, (_, i) => makePet({ id: i + 1 })),
      );

      await expect(
        service.create(1, { name: '여섯번째' }, undefined),
      ).rejects.toThrow(BadRequestException);
      expect(petRepository.create).not.toHaveBeenCalled();
    });

    it('이미지 업로드 후 imageUrl을 repository에 전달', async () => {
      petRepository.findAllByUserId.mockResolvedValue([]);
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/new.jpg',
      );
      petRepository.create.mockResolvedValue(
        makePet({ imageUrl: 'https://s3.example.com/new.jpg' }),
      );

      await service.create(1, { name: '뽀삐' }, Buffer.from('img'));

      expect(petRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ imageUrl: 'https://s3.example.com/new.jpg' }),
      );
    });

    it('DB create 실패 시 업로드된 이미지 롤백 삭제', async () => {
      petRepository.findAllByUserId.mockResolvedValue([]);
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/new.jpg',
      );
      awsService.deleteImage.mockResolvedValue(undefined);
      petRepository.create.mockRejectedValue(new Error('db error'));

      await expect(
        service.create(1, { name: '뽀삐' }, Buffer.from('img')),
      ).rejects.toThrow('db error');

      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/new.jpg',
      );
    });

    it('이미지 없이 DB create 실패 시 deleteImage 미호출', async () => {
      petRepository.findAllByUserId.mockResolvedValue([]);
      petRepository.create.mockRejectedValue(new Error('db error'));

      await expect(
        service.create(1, { name: '뽀삐' }, undefined),
      ).rejects.toThrow('db error');

      expect(awsService.deleteImage).not.toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('유저의 펫 목록 반환', async () => {
      petRepository.findAllByUserId.mockResolvedValue([makePet()]);

      const result = await service.findAllByUser(1);

      expect(petRepository.findAllByUserId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('펫 정상 조회', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());

      const result = await service.findOne(1, 1);

      expect(petRepository.findByIdAndUserId).toHaveBeenCalledWith(1, 1);
      expect(result.id).toBe(1);
    });

    it('펫 없음 - NotFoundException', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('이미지 교체 - 새 이미지 업로드 및 기존 이미지 삭제', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/new.jpg',
      );
      awsService.deleteImage.mockResolvedValue(undefined);
      petRepository.update.mockResolvedValue(
        makePet({ imageUrl: 'https://s3.example.com/new.jpg' }),
      );

      await service.update(1, 1, {}, Buffer.from('new'));

      expect(awsService.uploadImage).toHaveBeenCalledTimes(1);
      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://example.com/pet.jpg',
      );
    });

    it('기존 imageUrl 없을 때 이미지 교체 - deleteImage 미호출', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(
        makePet({ imageUrl: null }),
      );
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/new.jpg',
      );
      petRepository.update.mockResolvedValue(makePet());

      await service.update(1, 1, {}, Buffer.from('new'));

      expect(awsService.deleteImage).not.toHaveBeenCalled();
    });

    it('이미지 없이 수정 - uploadImage/deleteImage 미호출, 기존 imageUrl 유지', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      petRepository.update.mockResolvedValue(makePet());

      await service.update(1, 1, { name: '코코' }, undefined);

      expect(awsService.uploadImage).not.toHaveBeenCalled();
      expect(awsService.deleteImage).not.toHaveBeenCalled();
      expect(petRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ imageUrl: 'https://example.com/pet.jpg' }),
      );
    });

    it('이름 변경 시 updateData에 name 포함', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      petRepository.update.mockResolvedValue(makePet({ name: '코코' }));

      await service.update(1, 1, { name: '코코' }, undefined);

      expect(petRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: '코코' }),
      );
    });

    it('펫 없음 - NotFoundException', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.update(1, 999, {}, undefined)).rejects.toThrow(
        NotFoundException,
      );
      expect(petRepository.update).not.toHaveBeenCalled();
    });

    it('이미지 업로드 실패 - deleteImage와 DB update 미호출', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      awsService.uploadImage.mockRejectedValue(new Error('s3 error'));

      await expect(
        service.update(1, 1, {}, Buffer.from('new')),
      ).rejects.toThrow('s3 error');

      expect(awsService.deleteImage).not.toHaveBeenCalled();
      expect(petRepository.update).not.toHaveBeenCalled();
    });

    it('DB update 실패 시 새 이미지 롤백 삭제, 기존 이미지 보존', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/new.jpg',
      );
      awsService.deleteImage.mockResolvedValue(undefined);
      petRepository.update.mockRejectedValue(new Error('db error'));

      await expect(
        service.update(1, 1, {}, Buffer.from('new')),
      ).rejects.toThrow('db error');

      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/new.jpg',
      );
      expect(awsService.deleteImage).not.toHaveBeenCalledWith(
        'https://example.com/pet.jpg',
      );
    });

    it('이미지 교체 - uploadImage → DB update → deleteImage(기존) 순서', async () => {
      const order: string[] = [];
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      awsService.uploadImage.mockImplementation(() => {
        order.push('upload');
        return Promise.resolve('https://s3.example.com/new.jpg');
      });
      petRepository.update.mockImplementation(() => {
        order.push('db');
        return Promise.resolve(
          makePet({ imageUrl: 'https://s3.example.com/new.jpg' }),
        );
      });
      awsService.deleteImage.mockImplementation(() => {
        order.push('delete');
        return Promise.resolve(undefined);
      });

      await service.update(1, 1, {}, Buffer.from('new'));

      expect(order).toEqual(['upload', 'db', 'delete']);
    });
  });

  describe('remove', () => {
    it('이미지 있는 펫 삭제 - deleteImage 호출', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      awsService.deleteImage.mockResolvedValue(undefined);
      petRepository.deleteById.mockResolvedValue(undefined);
      petRepository.findAllByUserId.mockResolvedValue([]);

      await service.remove(1, 1);

      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://example.com/pet.jpg',
      );
      expect(petRepository.deleteById).toHaveBeenCalledWith(1);
    });

    it('이미지 없는 펫 삭제 - deleteImage 미호출', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(
        makePet({ imageUrl: null }),
      );
      petRepository.deleteById.mockResolvedValue(undefined);
      petRepository.findAllByUserId.mockResolvedValue([]);

      await service.remove(1, 1);

      expect(awsService.deleteImage).not.toHaveBeenCalled();
    });

    it('대표펫 삭제 + 남은 펫 있음 - 첫 번째 펫을 대표펫으로 설정', async () => {
      const representativePet = makePet({ isRepresentative: true });
      const remainingPet = makePet({ id: 2 });
      petRepository.findByIdAndUserId.mockResolvedValue(representativePet);
      awsService.deleteImage.mockResolvedValue(undefined);
      petRepository.deleteById.mockResolvedValue(undefined);
      petRepository.findAllByUserId.mockResolvedValue([remainingPet]);
      petRepository.setRepresentative.mockResolvedValue(remainingPet);

      await service.remove(1, 1);

      expect(petRepository.setRepresentative).toHaveBeenCalledWith(
        1,
        remainingPet.id,
      );
    });

    it('대표펫 삭제 + 남은 펫 없음 - setRepresentative 미호출', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(
        makePet({ isRepresentative: true }),
      );
      awsService.deleteImage.mockResolvedValue(undefined);
      petRepository.deleteById.mockResolvedValue(undefined);
      petRepository.findAllByUserId.mockResolvedValue([]);

      await service.remove(1, 1);

      expect(petRepository.setRepresentative).not.toHaveBeenCalled();
    });

    it('대표펫 아닌 펫 삭제 - setRepresentative 미호출', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(
        makePet({ isRepresentative: false }),
      );
      petRepository.deleteById.mockResolvedValue(undefined);
      awsService.deleteImage.mockResolvedValue(undefined);

      await service.remove(1, 1);

      expect(petRepository.findAllByUserId).not.toHaveBeenCalled();
      expect(petRepository.setRepresentative).not.toHaveBeenCalled();
    });

    it('펫 없음 - NotFoundException', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
      expect(petRepository.deleteById).not.toHaveBeenCalled();
    });

    it('이미지 삭제 실패 시 DB 삭제 미수행', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(makePet());
      awsService.deleteImage.mockRejectedValue(new Error('s3 error'));

      await expect(service.remove(1, 1)).rejects.toThrow('s3 error');

      expect(petRepository.deleteById).not.toHaveBeenCalled();
      expect(petRepository.setRepresentative).not.toHaveBeenCalled();
    });
  });

  describe('setRepresentative', () => {
    it('이미 대표펫이면 repository 호출 없이 반환', async () => {
      const pet = makePet({ isRepresentative: true });
      petRepository.findByIdAndUserId.mockResolvedValue(pet);

      const result = await service.setRepresentative(1, 1);

      expect(petRepository.setRepresentative).not.toHaveBeenCalled();
      expect(result).toEqual(pet);
    });

    it('대표펫 아닌 경우 setRepresentative 호출', async () => {
      const pet = makePet({ isRepresentative: false });
      const updated = makePet({ isRepresentative: true });
      petRepository.findByIdAndUserId.mockResolvedValue(pet);
      petRepository.setRepresentative.mockResolvedValue(updated);

      const result = await service.setRepresentative(1, 1);

      expect(petRepository.findByIdAndUserId).toHaveBeenCalledWith(1, 1);
      expect(petRepository.setRepresentative).toHaveBeenCalledWith(1, 1);
      expect(result.isRepresentative).toBe(true);
    });

    it('펫 없음 - NotFoundException', async () => {
      petRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.setRepresentative(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('검색 결과 반환', async () => {
      const mockResult: PetSearchResponse = {
        data: [{ id: 1, name: '뽀삐', imageUrl: null }],
        hasNext: false,
        cursor: null,
      };
      petRepository.searchByName.mockResolvedValue(mockResult);

      const result = await service.search({ q: '뽀삐', limit: 20 });

      expect(petRepository.searchByName).toHaveBeenCalledWith(
        '뽀삐',
        undefined,
        20,
      );
      expect(result).toEqual(mockResult);
    });
  });
});
