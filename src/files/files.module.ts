import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesSchema } from './file.schema';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from "multer"
import { uuid } from "uuidv4"
import { UsersServices } from 'src/users/users.service';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  imports: [
    MulterModule.registerAsync({
        useFactory: () => ({
          dest: './assets/uploads'
        }),
      }),
    MongooseModule.forFeature([{ name: 'Files', schema: FilesSchema}])
  ],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})

export class FilesModule {}