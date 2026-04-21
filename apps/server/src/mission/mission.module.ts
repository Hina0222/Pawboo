import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { MissionRepository } from './mission.repository';
import { PostRepository } from '../post/post.repository';
import { PetModule } from '../pet/pet.module';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, AwsModule, PetModule],
  controllers: [MissionController],
  providers: [MissionService, MissionRepository, PostRepository],
})
export class MissionModule {}
