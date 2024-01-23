import { Controller, Delete, Get, Post, Req } from '@nestjs/common';
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

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.categoriesService.save(body)
  }

  @Delete()
  async delete(@Req() req, res) {
    let { body } = req
    return this.categoriesService.delete(body.id)
  }
}
