import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model } from 'mongoose';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
    article: Article,
    token?: string
}

@Injectable()
export class ArticlesService {
    constructor(@InjectModel(Article.name) private articleModel: Model<Article>){}

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find().exec()
    }

    async findOne(slug: string): Promise<Article> {
        return await this.articleModel.findOne({slug: slug}).exec()
    }

    async findSimilar(title: string): Promise<Article[]> {
        return await this.articleModel.find({title: { $regex: new RegExp(title, 'i')}}).exec()
    }

    async save(article: Article): Promise<ReturnInterface> {
        const slug = article.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const new_article = new this.articleModel({...article, slug: slug})
        new_article.save()
        return {
            status: 200,
            message: 'article saved successfully.',
            article: new_article
        }
    }

    async update(article: Article, id: string): Promise<IReturn> {
        const slug = article.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        await this.articleModel.updateOne({_id: id}, {...article, slug: slug}).exec()
        return {
            status: 200,
            message: 'article updated successfully.',
        }
    }

    async delete(id: string) {
        await this.articleModel.findOneAndDelete({_id: id})
        return {
            status: 200,
            message: 'article deleted successfully'
        }
    }

    async getMultipleArticleByFieldIds(field, ids: string[]) {
        const articles = await this.articleModel.find({
            [field]: {
            $in: ids
        }}).exec()
        return {
            status: 200,
            artiicles: articles
        }
    }
}
