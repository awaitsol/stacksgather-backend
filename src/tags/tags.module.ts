import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
