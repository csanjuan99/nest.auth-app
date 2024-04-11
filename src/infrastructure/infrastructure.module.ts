import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PersistenceModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
  ],
  exports: [PersistenceModule],
})
export class InfrastructureModule {}
