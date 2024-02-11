import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesSchema } from './file.schema';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from "multer"
import { uuid } from "uuidv4"

@Module({
  imports: [
    MulterModule.registerAsync({
        useFactory: () => ({
          dest: './assets/uploads',
          limits: {
            fileSize: 100 * 1024 * 1024, // Set the maximum file size (in bytes)
          },
          storage: multer.diskStorage({
            destination: './assets/uploads',
            filename: (req, file, callback) => {
              // Generate a custom filename (you can use a library like uuid)
              const ext = file.originalname.split('.')
              const customFilename = `${uuid()}.${ext[ext.length - 1]}`;
              callback(null, customFilename);
            },
          }),
        }),
      }),
    MongooseModule.forFeature([{ name: 'Files', schema: FilesSchema}])
  ],
  controllers: [FilesController],
  providers: [FilesService],
})

export class FilesModule {}