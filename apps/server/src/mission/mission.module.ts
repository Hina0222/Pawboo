import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { MissionRepository } from './mission.repository';
import { PostModule } from '../post/post.module';
import { PetModule } from '../pet/pet.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, PetModule, PostModule],
  controllers: [MissionController],
  providers: [MissionService, MissionRepository],
})
export class MissionModule {}
