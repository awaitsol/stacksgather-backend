import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashTag } from '@prisma/client';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
  hashtag: HashTag,
  token?: string
}

@Controller('hashtags')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService) {}
    
    @Get()
    async findAll(@Req() req): Promise<HashTag[]> {
        const { query } = req;
        return this.hashtagService.findAll(query.search);
    }
    
    @Post('get-tag')
    async getTag(@Req() req, res): Promise<HashTag> {
        let { body } = req
        return this.hashtagService.find(body)
    }
    
    @Post()
    async save(@Req() req, res): Promise<ReturnInterface> {
        let { body } = req
        return this.hashtagService.save(body)
    }
    
    @Put()
    async update(@Req() req, res): Promise<IReturn> {
        let { body } = req
        return this.hashtagService.update(body, body.id)
    }
    
    @Delete()
    async delete(@Req() req, res) {
        let { body } = req
        return this.hashtagService.delete(body.id)
    }
    
    // @Post('/get-multiple-tags-by-id')
    // async getMultipleTagsById(@Req() req, res) {
    //     let { body } = req
    //     return await this.hashtagService.getMultipleTagsById(body._ids)
    // }
    
    // @Post('/get-mostly-used-tags')
    // async getMostlyUsedTags(@Req() req, res) {
    //     return await this.hashtagService.getMostlyUsedTags()
    // }
}
