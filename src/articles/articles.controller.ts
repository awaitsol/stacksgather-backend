import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.schema';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
  category: Article,
  token?: string
}

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll()
  }

  @Post('upload-file')
  async upload_file(@Req() req, res) {
    return this.articleService
  }

  @Post('by-parent-id')
  async findMainCategories(@Req() req, res): Promise<Article[]> {
    let { body } = req
    return this.articleService.findMain(body.parent_id)
  }

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.articleService.save(body)
  }

  @Put()
  async update(@Req() req, res): Promise<IReturn> {
    let { body } = req
    return this.articleService.update(body, body._id)
  }

  @Delete()
  async delete(@Req() req, res) {
    let { body } = req
    return this.articleService.delete(body.id)
  }
}
