import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.schema';
import { IReturn } from 'shared/types';

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

  @Post('by-parent-id')
  async findMainCategories(@Req() req, res): Promise<Category[]> {
    let { body } = req
    return this.categoriesService.findMain((body.parent_id))
  }

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.categoriesService.save(body)
  }

  @Put()
  async update(@Req() req, res): Promise<IReturn> {
    let { body } = req
    return this.categoriesService.update(body, body._id)
  }

  @Delete()
  async delete(@Req() req, res) {
    let { body } = req
    return this.categoriesService.delete(body.id)
  }
}
