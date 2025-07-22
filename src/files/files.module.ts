import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  imports: [
    MulterModule.registerAsync({
        useFactory: () => ({
          dest: './assets/uploads'
        }),
      }),
  ],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})

export class FilesModule {}