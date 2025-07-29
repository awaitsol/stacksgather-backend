import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [HashtagController],
  providers: [HashtagService, PrismaService]
})
export class HashtagModule {}
