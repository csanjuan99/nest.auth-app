import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [AuthController],
})
export class UserInterfaceModule {}
