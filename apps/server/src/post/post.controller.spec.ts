import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.type';
import type {
  PostListResponse,
  PostItem,
  PostResponse,
} from '@pawboo/schemas/post';

jest.mock('../aws/aws.service', () => ({
  AwsService: jest.fn(),
  IMAGE_PRESET: { POST: 'post' },
}));

const req = { user: { id: 1 } } as AuthenticatedRequest;

const mockPostResponse: PostResponse = {
  id: 1,
  petId: 1,
  type: 'general',
  missionId: null,
  imageUrls: ['https://s3.example.com/img.jpg'],
  createdAt: new Date('2024-01-01'),
};

const mockPostItem: PostItem = {
  id: 1,
  type: 'general',
  missionId: null,
  imageUrls: ['https://s3.example.com/img.jpg'],
  createdAt: '2024-01-01T00:00:00.000Z',
  pet: { id: 1, name: '뽀삐', imageUrl: 'https://example.com/pet.jpg' },
  likeCount: 3,
  isLiked: true,
};

const mockPostListResponse: PostListResponse = {
  data: [mockPostItem],
  hasNext: false,
  cursor: null,
};

describe('PostController', () => {
  let controller: PostController;
  let service: jest.Mocked<PostService>;

  const mockPostService = {
    createPost: jest.fn(),
    findPosts: jest.fn(),
    findMyPosts: jest.fn(),
    findLikedPosts: jest.fn(),
    findPetPosts: jest.fn(),
    findOnePost: jest.fn(),
    deletePost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostController>(PostController);
    service = module.get<jest.Mocked<PostService>>(PostService);

    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('포스트 생성 요청을 서비스에 전달', async () => {
      service.createPost.mockResolvedValue(mockPostResponse);
      const files = [{ buffer: Buffer.from('img') }] as Express.Multer.File[];

      const result = await controller.createPost(req, files);

      expect(service.createPost).toHaveBeenCalledWith(1, [files[0].buffer]);
      expect(result).toEqual(mockPostResponse);
    });
  });

  describe('findPosts', () => {
    it('전체 피드 정상 조회', async () => {
      service.findPosts.mockResolvedValue(mockPostListResponse);

      const result = await controller.findPosts(req, {});

      expect(service.findPosts).toHaveBeenCalledWith(1, {});
      expect(result).toEqual(mockPostListResponse);
    });

    it('유효한 쿼리 파라미터 파싱', async () => {
      service.findPosts.mockResolvedValue(mockPostListResponse);

      await controller.findPosts(req, { cursor: '10', missionId: '5' });

      expect(service.findPosts).toHaveBeenCalledWith(1, {
        cursor: 10,
        missionId: 5,
      });
    });

    it('잘못된 쿼리 파라미터 - BadRequestException', () => {
      expect(() => controller.findPosts(req, { cursor: 'invalid' })).toThrow(
        BadRequestException,
      );
      expect(service.findPosts).not.toHaveBeenCalled();
    });
  });

  describe('findMyPosts', () => {
    it('내 포스트 조회 요청을 서비스에 전달', async () => {
      service.findMyPosts.mockResolvedValue(mockPostListResponse);

      const result = await controller.findMyPosts(req, {});

      expect(service.findMyPosts).toHaveBeenCalledWith(1, {});
      expect(result).toEqual(mockPostListResponse);
    });

    it('유효한 쿼리 파라미터 파싱', async () => {
      service.findMyPosts.mockResolvedValue(mockPostListResponse);

      await controller.findMyPosts(req, { cursor: '10', missionId: '5' });

      expect(service.findMyPosts).toHaveBeenCalledWith(1, {
        cursor: 10,
        missionId: 5,
      });
    });

    it('잘못된 쿼리 파라미터 - BadRequestException', () => {
      expect(() => controller.findMyPosts(req, { cursor: 'abc' })).toThrow(
        BadRequestException,
      );
      expect(service.findMyPosts).not.toHaveBeenCalled();
    });
  });

  describe('findLikedPosts', () => {
    it('좋아요한 포스트 조회 요청을 서비스에 전달', async () => {
      service.findLikedPosts.mockResolvedValue(mockPostListResponse);

      const result = await controller.findLikedPosts(req, {});

      expect(service.findLikedPosts).toHaveBeenCalledWith(1, {});
      expect(result).toEqual(mockPostListResponse);
    });

    it('cursor 쿼리 파라미터 파싱', async () => {
      service.findLikedPosts.mockResolvedValue(mockPostListResponse);

      await controller.findLikedPosts(req, { cursor: '10' });

      expect(service.findLikedPosts).toHaveBeenCalledWith(1, { cursor: 10 });
    });

    it('잘못된 쿼리 파라미터 - BadRequestException', () => {
      expect(() =>
        controller.findLikedPosts(req, { cursor: 'invalid' }),
      ).toThrow(BadRequestException);
      expect(service.findLikedPosts).not.toHaveBeenCalled();
    });
  });

  describe('findPetPosts', () => {
    it('특정 펫 포스트 조회 요청을 서비스에 전달', async () => {
      service.findPetPosts.mockResolvedValue(mockPostListResponse);

      const result = await controller.findPetPosts(req, 2, {});

      expect(service.findPetPosts).toHaveBeenCalledWith(1, 2, {});
      expect(result).toEqual(mockPostListResponse);
    });

    it('유효한 쿼리 파라미터 파싱', async () => {
      service.findPetPosts.mockResolvedValue(mockPostListResponse);

      await controller.findPetPosts(req, 2, { cursor: '10', missionId: '5' });

      expect(service.findPetPosts).toHaveBeenCalledWith(1, 2, {
        cursor: 10,
        missionId: 5,
      });
    });

    it('잘못된 쿼리 파라미터 - BadRequestException', () => {
      expect(() =>
        controller.findPetPosts(req, 2, { cursor: 'invalid' }),
      ).toThrow(BadRequestException);
      expect(service.findPetPosts).not.toHaveBeenCalled();
    });
  });

  describe('findOnePost', () => {
    it('단일 포스트 조회 요청을 서비스에 전달', async () => {
      service.findOnePost.mockResolvedValue(mockPostItem);

      const result = await controller.findOnePost(req, 1);

      expect(service.findOnePost).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockPostItem);
    });
  });

  describe('deletePost', () => {
    it('포스트 삭제 요청을 서비스에 전달', async () => {
      service.deletePost.mockResolvedValue(undefined);

      await controller.deletePost(req, 1);

      expect(service.deletePost).toHaveBeenCalledWith(1, 1);
    });
  });
});
