import { Module } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleCommentsController } from './article-comments.controller';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [ArticleCommentsController],
  providers: [ArticleCommentsService, PrismaService],
})
export class ArticleCommentsModule {}
