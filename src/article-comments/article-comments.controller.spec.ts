import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentsController } from './article-comments.controller';
import { ArticleCommentsService } from './article-comments.service';

describe('CommentsController', () => {
  let controller: ArticleCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCommentsController],
      providers: [ArticleCommentsService],
    }).compile();

    controller = module.get<ArticleCommentsController>(ArticleCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
