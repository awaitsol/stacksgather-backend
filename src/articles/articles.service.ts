import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model, Types } from 'mongoose';
import { IReturn } from 'shared/types';
import { PrismaService } from 'prisma/primsa.service';

interface ReturnInterface extends IReturn {
    article: any,
    token?: string
}

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>,
        private prisma: PrismaService
    ){}

    async findAll(): Promise<any[]> {
        return await this.prisma.article.findMany({
            include: {
                tags: {
                    select: {
                        tag: true
                    }
                },
                categories: {
                    select: {
                        category: true
                    }
                }
            },
            orderBy: { id: "desc" }
        })
    }

    async findAllWithTags(): Promise<any[]> {
        return await this.prisma.article.findMany({
            include: {
                tags: {
                    select: {
                        tag: true
                    }
                }
            }
        })
    }

    async findOne(slug: string): Promise<any> {
        return await this.prisma.article.findFirst({
            where: {slug: slug},
            include: {
                categories: {
                    select: {
                        category: true
                    }
                },
                tags: {
                    select: {
                        tag: true
                    }
                }
            }
        })
    }

    async findSimilar(title: string): Promise<any[]> {
        return await this.prisma.article.findMany({
            where: { title: { contains: title} }
        })
    }

    async save(article: any): Promise<ReturnInterface> {
        const slug = article.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const new_article = await this.prisma.article.create({
            data: {...article, slug: slug}
        })
        return {
            status: 200,
            message: 'article saved successfully.',
            article: new_article
        }
    }

    async update(article: any, id: number): Promise<IReturn> {
        const slug = article.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        delete article.categories
        delete article.tags
        await this.prisma.article.update({
            where: {id: id}, data: {...article, slug: slug}
        })

        return {
            status: 200,
            message: 'article updated successfully.',
        }
    }

    async delete(id: number) {
        await this.prisma.article.delete({where: {id: id}})
        return {
            status: 200,
            message: 'article deleted successfully'
        }
    }

    async getMultipleArticleByFieldIds(ids: number[]) {

        const articles = await this.prisma.category.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            include: {
                articles: {
                    select: {
                        article: true
                    }
                }
            }
        })

        return {
            status: 200,
            articles: articles
        }
    }

    async getMultipleArticleByTagIds(ids: number[]) {

        const articlesByTag = await this.prisma.tag.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            include: {
                articles: {
                    select: {
                        article: true
                    }
                }
            }
        })

        return {
            status: 200,
            articles: articlesByTag
        }
    }
}
