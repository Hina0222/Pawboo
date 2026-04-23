import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PetModule } from '../pet/pet.module';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, AwsModule, PetModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
