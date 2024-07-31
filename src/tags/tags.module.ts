import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './tag.schema';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema}])
  ],
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
