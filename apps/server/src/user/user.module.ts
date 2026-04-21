import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, AwsModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
