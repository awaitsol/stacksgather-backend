import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCommentsService } from './article-comments.service';

describe('CommentsService', () => {
  let service: ArticleCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleCommentsService],
    }).compile();

    service = module.get<ArticleCommentsService>(ArticleCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
