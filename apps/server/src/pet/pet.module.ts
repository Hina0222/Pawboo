import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { PetRepository } from './pet.repository';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [PetController],
  providers: [PetService, PetRepository],
  exports: [PetRepository],
})
export class PetModule {}
