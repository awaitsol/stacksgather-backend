import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleComments } from './article-comments.schema';
import { CommentResponse } from './comment-response.schema';

@Controller('article-comments')
export class ArticleCommentsController {
  constructor(private readonly commentsService: ArticleCommentsService) {}

  @Post()
  create(@Body() body: ArticleComments) {
    return this.commentsService.create(body);
  }

  @Post('response')
  createResponse(@Body() body: CommentResponse) {
    return this.commentsService.createResponse(body);
  }

  @Post('remove-response')
  removeResponse(@Body() body: CommentResponse) {
    return this.commentsService.removeResponse(body);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.commentsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(Number(id));
  }
}
