import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Page } from './page.schema';
import { Model } from 'mongoose';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
    article: Page,
    token?: string
}

@Injectable()
export class PageService {
    constructor(@InjectModel(Page.name) private pageModel: Model<Page>){}

    async findAll(): Promise<Page[]> {
        return await this.pageModel.find().exec()
    }

    async findOne(slug: string): Promise<Page> {
        return await this.pageModel.findOne({slug: slug}).exec()
    }

    async save(page: Page): Promise<ReturnInterface> {
        const slug = page.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const new_page = new this.pageModel({...page, slug: slug})
        new_page.save()
        return {
            status: 200,
            message: 'Page saved successfully.',
            article: new_page
        }
    }

    async update(page: Page, id: string): Promise<IReturn> {
        const slug = page.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        await this.pageModel.updateOne({_id: id}, {...page, slug: slug}).exec()
        return {
            status: 200,
            message: 'Page updated successfully.',
        }
    }

    async delete(id: string) {
        await this.pageModel.findOneAndDelete({_id: id})
        return {
            status: 200,
            message: 'Page deleted successfully'
        }
    }
}
