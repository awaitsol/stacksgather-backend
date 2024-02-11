import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model } from 'mongoose';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
    category: Article,
    token?: string
}

@Injectable()
export class ArticlesService {
    constructor(@InjectModel(Article.name) private articleModel: Model<Article>){}

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find().exec()
    }

    async upload_file(body) {
        console.log('body', body)
    }

    async findMain(id: string): Promise<Article[]> {
        let query = id ? { parent_id: id} : {$or: [{ parent_id : { $exists: false } }, { parent_id: "" } ]}
        return await this.articleModel.find(query).exec()
    }

    async save(article: Article): Promise<ReturnInterface> {
        let new_category = new this.articleModel(article)
        new_category.save()
        return {
            status: 200,
            message: 'category saved successfully.',
            category: new_category
        }
    }

    async update(article: Article, id: string): Promise<IReturn> {
        let new_category = await this.articleModel.updateOne({_id: id}, article).exec()
        return {
            status: 200,
            message: 'category updated successfully.',
        }
    }

    async delete(id: string) {
        await this.articleModel.findOneAndDelete({_id: id})
        return {
            status: 200,
            message: 'category deleted successfully'
        }
    }
}
