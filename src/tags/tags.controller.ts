import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './tag.schema';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
  tag: Tag,
  token?: string
}

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@Req() req): Promise<Tag[]> {
    const { query } = req;
    return this.tagsService.findAll(query.search);
  }

  @Post('get-tag')
  async getTag(@Req() req, res): Promise<Tag> {
    let { body } = req
    return this.tagsService.find(body)
  }

  @Post()
  async save(@Req() req, res): Promise<ReturnInterface> {
    let { body } = req
    return this.tagsService.save(body)
  }

  @Put()
  async update(@Req() req, res): Promise<IReturn> {
    let { body } = req
    return this.tagsService.update(body, body._id)
  }

  @Delete()
  async delete(@Req() req, res) {
    let { body } = req
    return this.tagsService.delete(body.id)
  }

  @Post('/get-multiple-tags-by-id')
  async getMultipleTagsById(@Req() req, res) {
    let { body } = req
    return await this.tagsService.getMultipleTagsById(body._ids)
  }

  @Post('/get-mostly-used-tags')
  async getMostlyUsedTags(@Req() req, res) {
    return await this.tagsService.getMostlyUsedTags()
  }
}
