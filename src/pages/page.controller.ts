import { Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { PageService } from './page.service';
import { IReturn } from 'shared/types';
import { Page } from '@prisma/client';

interface ReturnInterface extends IReturn {
  article: Page,
  token?: string
}

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  async findAll(): Promise<Page[]> {
    return this.pageService.findAll()
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<Page> {
    return this.pageService.findOne(slug)
  }

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.pageService.save(body)
  }

  @Put()
  async update(@Req() req, res): Promise<IReturn> {
    let { body } = req
    return this.pageService.update(body, body._id)
  }

  @Delete(':id')
  async delete(@Param('id') id, @Req() req) {
    return this.pageService.delete(id)
  }
  
}