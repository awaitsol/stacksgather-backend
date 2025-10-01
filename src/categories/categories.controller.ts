import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { IReturn } from 'shared/types';
import { Category } from '@prisma/client';

interface ReturnInterface extends IReturn {
  category: Category,
  token?: string
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll()
  }

  @Post('get-category')
  async getCategory(@Req() req, res): Promise<Category> {
    let {body} = req
    return this.categoriesService.find(body)
  }

  @Post('get-categories')
  async getCategories(@Req() req, res): Promise<Category[]> {
    let {body} = req
    return this.categoriesService.getAll(body)
  }

  @Post('by-parent-id')
  async findMainCategories(@Req() req, res): Promise<Category[]> {
    let { body, query } = req
    return this.categoriesService.findMain(body.parent_id, query?.search)
  }

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.categoriesService.save(body)
  }

  @Put()
  async update(@Req() req, res): Promise<IReturn> {
    let { body } = req
    return this.categoriesService.update(body, body.id)
  }

  @Delete()
  async delete(@Req() req, res) {
    let { body } = req
    return this.categoriesService.delete(body.id)
  }

  @Post('user-categories')
  async userCategories(@Req() req, res): Promise<Category[]> {
    let { user_id } = req.body
    return this.categoriesService.userCategories(user_id)
  }

  @Post('articles-categories')
  async getArticlesCategories(@Req() req, res) {
    const { orderBy, whereClause } = req.body
    return this.categoriesService.getArticlesCategories({
      orderBy,
      whereClause
    });
  }

  @Get('search')
  async search(@Req() req, res) {
    return this.categoriesService.search(req.query)
  }
}
