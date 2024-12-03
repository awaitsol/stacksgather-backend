import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model, Types } from 'mongoose';
import { IError, IReturn } from 'shared/types';
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
                author: true,
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
            where: { title: { contains: title} },
            include: {
                author: true,
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

    async save(article: any): Promise<ReturnInterface> {
        const slug = article.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const categoryIds = article.categories
        const tagIds = article.tags
        delete article.categories
        delete article.tags

        const new_article = await this.prisma.article.create({
            data: {...article, slug: slug}
        })

        await this.prisma.articleTags.createMany({
            data: tagIds.map(tagId => ({ articleId: new_article.id, tagId: tagId }))
        })

        await this.prisma.articleCategories.createMany({
            data: categoryIds.map(catId => ({ articleId: new_article.id, categoryId: catId }))
        })

        return {
            status: 200,
            message: 'article saved successfully.',
            article: new_article
        }
    }

    async update(article: any, id: number): Promise<IReturn | IError> {
        try {
            const slug = article.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
            const categoryIds = article.categories
            const tagIds = article.tags
            delete article.categories
            delete article.tags
            await this.prisma.article.update({
                where: {id: id}, data: {...article, slug: slug}
            })

            await this.prisma.articleTags.deleteMany({
                where: {
                    articleId: id
                }
            })
            await this.prisma.articleTags.createMany({
                data: tagIds.map(tagId => ({ articleId: id, tagId: tagId }))
            })

            await this.prisma.articleCategories.deleteMany({
                where: {
                    articleId: id
                }
            })
            await this.prisma.articleCategories.createMany({
                data: categoryIds.map(catId => ({ articleId: id, categoryId: catId }))
            })
    
            return {
                status: 200,
                message: 'article updated successfully.',
            }
        }
        catch (e) {
            return {
                status: 404,
                message: e.message,
                error: e
            }
        }
    }

    async delete(id: number) {
        await this.prisma.articleCategories.deleteMany({where: {articleId: id}});
        await this.prisma.articleTags.deleteMany({where: {articleId: id}});
        await this.prisma.article.delete({where: {id: Number(id)}});
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
