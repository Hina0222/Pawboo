import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PetRepository } from '../pet/pet.repository';
import { AwsService } from '../aws/aws.service';

jest.mock('../aws/aws.service', () => ({
  AwsService: jest.fn(),
  IMAGE_PRESET: { POST: 'post' },
}));

const mockPet = {
  id: 1,
  userId: 1,
  name: '뽀삐',
  imageUrl: 'https://example.com/pet.jpg',
  isRepresentative: true,
  createdAt: new Date('2024-01-01'),
};

const mockPostListRow = {
  id: 1,
  type: 'general' as const,
  missionId: null,
  imageUrls: ['https://s3.example.com/img.jpg'],
  createdAt: new Date('2024-01-01'),
};

const mockPostDetailRow = {
  ...mockPostListRow,
  petId: 1,
  petName: '뽀삐',
  petImageUrl: 'https://example.com/pet.jpg' as string | null,
};

const mockPostResponse = {
  id: 1,
  petId: 1,
  type: 'general' as const,
  missionId: null,
  imageUrls: ['https://s3.example.com/img.jpg'],
  createdAt: new Date('2024-01-01'),
};

const mockFindPostsResult = {
  rows: [mockPostListRow],
  hasNext: false,
  cursor: null,
};

describe('PostService', () => {
  let service: PostService;
  let postRepository: jest.Mocked<PostRepository>;
  let petRepository: jest.Mocked<PetRepository>;
  let awsService: jest.Mocked<AwsService>;

  const mockPostRepository = {
    createPost: jest.fn(),
    findByMissionIdAndPetId: jest.fn(),
    findPosts: jest.fn(),
    findLikedPosts: jest.fn(),
    findOnePost: jest.fn(),
    findPostWithOwner: jest.fn(),
    deletePost: jest.fn(),
    getLikedPosts: jest.fn(),
    getLikeCounts: jest.fn(),
  };

  const mockPetRepository = {
    findRepresentativeByUserId: jest.fn(),
  };

  const mockAwsService = {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PostRepository, useValue: mockPostRepository },
        { provide: PetRepository, useValue: mockPetRepository },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<jest.Mocked<PostRepository>>(PostRepository);
    petRepository = module.get<jest.Mocked<PetRepository>>(PetRepository);
    awsService = module.get<jest.Mocked<AwsService>>(AwsService);

    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('정상 포스트 생성', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(mockPet);
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/img.jpg',
      );
      postRepository.createPost.mockResolvedValue(mockPostResponse);

      const result = await service.createPost(1, [Buffer.from('img')]);

      expect(petRepository.findRepresentativeByUserId).toHaveBeenCalledWith(1);
      expect(awsService.uploadImage).toHaveBeenCalledTimes(1);
      expect(postRepository.createPost).toHaveBeenCalledWith({
        petId: mockPet.id,
        type: 'general',
        missionId: null,
        imageUrls: ['https://s3.example.com/img.jpg'],
      });
      expect(result.id).toBe(1);
    });

    it('미션 포스트 생성 시 type이 mission', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(mockPet);
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/img.jpg',
      );
      postRepository.createPost.mockResolvedValue({
        ...mockPostResponse,
        type: 'mission',
        missionId: 5,
      });

      await service.createPost(1, [Buffer.from('img')], 5);

      expect(postRepository.createPost).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mission', missionId: 5 }),
      );
    });

    it('이미지 여러 장 업로드', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(mockPet);
      awsService.uploadImage
        .mockResolvedValueOnce('https://s3.example.com/img1.jpg')
        .mockResolvedValueOnce('https://s3.example.com/img2.jpg')
        .mockResolvedValueOnce('https://s3.example.com/img3.jpg');
      postRepository.createPost.mockResolvedValue(mockPostResponse);

      await service.createPost(1, [
        Buffer.from('img1'),
        Buffer.from('img2'),
        Buffer.from('img3'),
      ]);

      expect(awsService.uploadImage).toHaveBeenCalledTimes(3);
      expect(postRepository.createPost).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrls: [
            'https://s3.example.com/img1.jpg',
            'https://s3.example.com/img2.jpg',
            'https://s3.example.com/img3.jpg',
          ],
        }),
      );
    });

    it('대표 펫 없음 - BadRequestException', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(null);

      await expect(service.createPost(1, [Buffer.from('img')])).rejects.toThrow(
        BadRequestException,
      );
      expect(awsService.uploadImage).not.toHaveBeenCalled();
      expect(postRepository.createPost).not.toHaveBeenCalled();
    });

    it('DB 저장 실패 시 업로드된 이미지 삭제', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(mockPet);
      awsService.uploadImage.mockResolvedValue(
        'https://s3.example.com/img.jpg',
      );
      postRepository.createPost.mockRejectedValue(new Error('db error'));
      awsService.deleteImage.mockResolvedValue(undefined);

      await expect(service.createPost(1, [Buffer.from('img')])).rejects.toThrow(
        'db error',
      );
      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/img.jpg',
      );
    });

    it('여러 이미지 업로드 후 DB 실패 시 모두 삭제', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(mockPet);
      awsService.uploadImage
        .mockResolvedValueOnce('https://s3.example.com/img1.jpg')
        .mockResolvedValueOnce('https://s3.example.com/img2.jpg');
      postRepository.createPost.mockRejectedValue(new Error('db error'));
      awsService.deleteImage.mockResolvedValue(undefined);

      await expect(
        service.createPost(1, [Buffer.from('img1'), Buffer.from('img2')]),
      ).rejects.toThrow('db error');

      expect(awsService.deleteImage).toHaveBeenCalledTimes(2);
      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/img1.jpg',
      );
      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/img2.jpg',
      );
    });
  });

  describe('findPosts', () => {
    it('전체 피드 정상 조회', async () => {
      postRepository.findPosts.mockResolvedValue(mockFindPostsResult);

      const result = await service.findPosts({});

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({
        id: 1,
        type: 'general',
        missionId: null,
        imageUrls: ['https://s3.example.com/img.jpg'],
        createdAt: '2024-01-01T00:00:00.000Z',
      });
      expect(result.hasNext).toBe(false);
      expect(postRepository.findPosts).toHaveBeenCalledWith({});
    });

    it('결과 없으면 빈 배열 반환', async () => {
      postRepository.findPosts.mockResolvedValue({
        rows: [],
        hasNext: false,
        cursor: null,
      });

      const result = await service.findPosts({});

      expect(result.data).toHaveLength(0);
    });
  });

  describe('findMyPosts', () => {
    it('대표 펫 없음 - 빈 결과 반환', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(null);

      const result = await service.findMyPosts(1, {});

      expect(result).toEqual({ data: [], hasNext: false, cursor: null });
      expect(postRepository.findPosts).not.toHaveBeenCalled();
    });

    it('대표 펫 기준 포스트 정상 조회', async () => {
      petRepository.findRepresentativeByUserId.mockResolvedValue(mockPet);
      postRepository.findPosts.mockResolvedValue(mockFindPostsResult);

      const result = await service.findMyPosts(1, {});

      expect(result.data).toHaveLength(1);
      expect(postRepository.findPosts).toHaveBeenCalledWith({}, mockPet.id);
    });
  });

  describe('findLikedPosts', () => {
    const mockFindLikedPostsResult = {
      rows: [{ ...mockPostListRow, likeCursorId: 10 }],
      hasNext: false,
      cursor: null,
    };

    it('좋아요한 포스트 정상 조회', async () => {
      postRepository.findLikedPosts.mockResolvedValue(mockFindLikedPostsResult);

      const result = await service.findLikedPosts(1, {});

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({
        id: 1,
        type: 'general',
        missionId: null,
        imageUrls: ['https://s3.example.com/img.jpg'],
        createdAt: '2024-01-01T00:00:00.000Z',
      });
      expect(result.hasNext).toBe(false);
      expect(postRepository.findLikedPosts).toHaveBeenCalledWith(1, undefined);
    });

    it('cursor 전달', async () => {
      postRepository.findLikedPosts.mockResolvedValue(mockFindLikedPostsResult);

      await service.findLikedPosts(1, { cursor: 5 });

      expect(postRepository.findLikedPosts).toHaveBeenCalledWith(1, 5);
    });

    it('결과 없으면 빈 배열 반환', async () => {
      postRepository.findLikedPosts.mockResolvedValue({
        rows: [],
        hasNext: false,
        cursor: null,
      });

      const result = await service.findLikedPosts(1, {});

      expect(result.data).toHaveLength(0);
      expect(result.hasNext).toBe(false);
      expect(result.cursor).toBeNull();
    });

    it('hasNext true이면 cursor 반환', async () => {
      postRepository.findLikedPosts.mockResolvedValue({
        rows: [
          { ...mockPostListRow, likeCursorId: 10 },
          { ...mockPostListRow, id: 2, likeCursorId: 9 },
        ],
        hasNext: true,
        cursor: 9,
      });

      const result = await service.findLikedPosts(1, {});

      expect(result.hasNext).toBe(true);
      expect(result.cursor).toBe(9);
    });
  });

  describe('findPetPosts', () => {
    it('특정 펫 포스트 정상 조회', async () => {
      postRepository.findPosts.mockResolvedValue(mockFindPostsResult);

      const result = await service.findPetPosts(2, {});

      expect(result.data).toHaveLength(1);
      expect(postRepository.findPosts).toHaveBeenCalledWith({}, 2);
    });
  });

  describe('findOnePost', () => {
    it('게시물 없음 - NotFoundException', async () => {
      postRepository.findOnePost.mockResolvedValue(null);

      await expect(service.findOnePost(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(postRepository.getLikedPosts).not.toHaveBeenCalled();
      expect(postRepository.getLikeCounts).not.toHaveBeenCalled();
    });

    it('단일 게시물 정상 조회', async () => {
      postRepository.findOnePost.mockResolvedValue(mockPostDetailRow);
      postRepository.getLikedPosts.mockResolvedValue(new Map([[1, true]]));
      postRepository.getLikeCounts.mockResolvedValue(new Map([[1, 5]]));

      const result = await service.findOnePost(1, 1);

      expect(result.id).toBe(1);
      expect(result.likeCount).toBe(5);
      expect(result.isLiked).toBe(true);
      expect(result.pet).toEqual({
        id: mockPostDetailRow.petId,
        name: mockPostDetailRow.petName,
        imageUrl: mockPostDetailRow.petImageUrl,
      });
    });

    it('좋아요 누르지 않은 게시물 - isLiked false', async () => {
      postRepository.findOnePost.mockResolvedValue(mockPostDetailRow);
      postRepository.getLikedPosts.mockResolvedValue(new Map());
      postRepository.getLikeCounts.mockResolvedValue(new Map([[1, 2]]));

      const result = await service.findOnePost(1, 1);

      expect(result.isLiked).toBe(false);
      expect(result.likeCount).toBe(2);
    });

    it('petImageUrl이 null이면 pet.imageUrl도 null', async () => {
      postRepository.findOnePost.mockResolvedValue({
        ...mockPostDetailRow,
        petImageUrl: null,
      });
      postRepository.getLikedPosts.mockResolvedValue(new Map());
      postRepository.getLikeCounts.mockResolvedValue(new Map());

      const result = await service.findOnePost(1, 1);

      expect(result.pet.imageUrl).toBeNull();
    });

    it('missionId가 있는 포스트 매핑', async () => {
      postRepository.findOnePost.mockResolvedValue({
        ...mockPostDetailRow,
        type: 'mission',
        missionId: 5,
      });
      postRepository.getLikedPosts.mockResolvedValue(new Map());
      postRepository.getLikeCounts.mockResolvedValue(new Map());

      const result = await service.findOnePost(1, 1);

      expect(result.missionId).toBe(5);
      expect(result.type).toBe('mission');
    });

    it('likeCount와 getLikedPosts를 병렬 조회', async () => {
      postRepository.findOnePost.mockResolvedValue(mockPostDetailRow);
      postRepository.getLikedPosts.mockResolvedValue(new Map());
      postRepository.getLikeCounts.mockResolvedValue(new Map());

      await service.findOnePost(1, 1);

      expect(postRepository.getLikedPosts).toHaveBeenCalledWith(1, [1]);
      expect(postRepository.getLikeCounts).toHaveBeenCalledWith([1]);
    });
  });

  describe('deletePost', () => {
    it('게시물 없거나 권한 없음 - NotFoundException', async () => {
      postRepository.findPostWithOwner.mockResolvedValue(null);

      await expect(service.deletePost(1, 999)).rejects.toThrow(
        NotFoundException,
      );
      expect(postRepository.deletePost).not.toHaveBeenCalled();
      expect(awsService.deleteImage).not.toHaveBeenCalled();
    });

    it('정상 삭제 및 이미지 삭제', async () => {
      postRepository.findPostWithOwner.mockResolvedValue({
        id: 1,
        imageUrls: [
          'https://s3.example.com/img1.jpg',
          'https://s3.example.com/img2.jpg',
        ],
      });
      postRepository.deletePost.mockResolvedValue(mockPostResponse);
      awsService.deleteImage.mockResolvedValue(undefined);

      await service.deletePost(1, 1);

      expect(postRepository.deletePost).toHaveBeenCalledWith(1);
      expect(awsService.deleteImage).toHaveBeenCalledTimes(2);
      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/img1.jpg',
      );
      expect(awsService.deleteImage).toHaveBeenCalledWith(
        'https://s3.example.com/img2.jpg',
      );
    });
  });
});
