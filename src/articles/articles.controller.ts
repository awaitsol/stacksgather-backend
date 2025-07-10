import { Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.schema';
import { IError, IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
  article: Article,
  token?: string
}

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async findAll(@Req() req): Promise<{ total: number, articles: Article[] }> {
    const { query } = req;
    return this.articleService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<Article> {
    return this.articleService.findOne(slug)
  }

  @Get('/similar/:title')
  async findSimilar(@Param('title') title): Promise<Article[]> {
    return this.articleService.findSimilar(title)
  }

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.articleService.save(body)
  }

  @Put()
  async update(@Req() req, res): Promise<IReturn | IError> {
    let { body } = req
    return this.articleService.update(body, body.id)
  }

  @Delete(':id')
  async delete(@Param('id') id, @Req() req) {
    return this.articleService.delete(Number(id))
  }

  @Post('/user/:id')
  async userArticles(@Param('id') id, @Req() req) {
    const { category_id } = req.body
    return this.articleService.userArticles(id, category_id)
  }

  @Post('/articles-by-tag-ids')
  async getMultipleArticleByTagIds(@Req() req) {
    let { body } = req
    return this.articleService.getMultipleArticleByTagIds(body._ids)
  }

  @Post('/articles-by-category-ids')
  async getMultipleArticleByCategoryIds(@Req() req) {
    let { body } = req
    return this.articleService.getMultipleArticleByFieldIds(body._ids)
  }
}