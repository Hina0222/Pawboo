import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, AwsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
