import { Injectable } from '@nestjs/common';
import { IError, IReturn } from 'shared/types';
import { PrismaService } from 'prisma/primsa.service';

interface ReturnInterface extends IReturn {
    article: any,
    token?: string
}

@Injectable()
export class ArticlesService {
    constructor( private prisma: PrismaService ) {}

    async findAll(query: any = {}): Promise<{ total: number, articles: any[] }> {

        const { authorId, categoryId, queryString, take, skip } = query

        let whereClause: any = {
            OR: [
                {
                    categories: {
                        some: {
                            category: { title: { contains: queryString} },
                        }
                    }
                },
                {
                    tags: { 
                        some: { 
                            tag: { title: { contains: queryString } }
                        }
                    }
                },
                {
                    title: { contains: queryString }
                },
                {
                    slug: { contains: queryString }
                }
            ]
        }

        if(authorId) {
            whereClause.authorId = Number(authorId)
        }

        if(categoryId && Number(categoryId) > 0) {
            whereClause.categories = {
                some: { categoryId: Number(categoryId) }
            }
        }

        let articleQueryObj: any = {
            orderBy: { id: "desc" },
            include: {
                author: true,
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
            }
        }

        if((categoryId && Number(categoryId) > 0) || queryString || authorId) {
            articleQueryObj.where = { ...whereClause };
        }

        const total = await this.prisma.article.count({ where: whereClause })

        if(skip) {
            articleQueryObj.skip = Number(skip)
        }

        if(take) {
            articleQueryObj.take = Number(take)
        }

        const articles = await this.prisma.article.findMany(articleQueryObj)

        return {
            total: total,
            articles: articles
        }
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
                article_hashtags: {
                    select: {
                        hashtag: true
                    }
                },
                tags: {
                    select: {
                        tag: true
                    }
                },
                article_comments: {
                    orderBy: { id: "desc" },
                    where: { replyToId: null },
                    include: {
                        user: true,
                        reply_comments: {
                            include: { user: true, reply_comment: true, comment_responses: true }
                        },
                        comment_responses: true
                    }
                }
            }
        })
    }

    async findSimilar(title: string): Promise<any[]> {

        const artilce = await this.prisma.article.findFirst({
            where: {title: {contains: title}},
            select: {
                categories: {
                    select: {categoryId: true}
                },
                tags: {
                    select: { tagId: true }
                }
            }
        })

        const similar_tags = artilce.tags.map(t => t.tagId)
        const similar_catgories = artilce.categories.map(t => t.categoryId)

        const similar_articles = await this.prisma.article.findMany({
            where: {
                OR: [
                    { tags: { some: { tagId: { in: similar_tags } } } },
                    { categories: { some: { categoryId: { in: similar_catgories } } } }
                ]
            },
            orderBy: {
                id: "desc"
            },
            take: 6,
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

        return similar_articles;
    }

    slugify = (title) => {
        return title
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')               // Replace & with 'and'
            .replace(/[^a-z0-9\s-]/g, '')       // Remove special characters
            .replace(/\s+/g, '-')               // Replace spaces with hyphens
            .replace(/-+/g, '-');               // Replace multiple hyphens with one
    };

    async save(article: any): Promise<ReturnInterface> {
        const slug = this.slugify(article.title);
        const categoryIds = article.categories ?? []
        const tagIds = article.tags ?? []
        const hashtagIds = article.hashtags ?? []
        delete article.categories
        delete article.tags
        delete article.hashtags

        let new_article = await this.prisma.article.create({
            data: {...article, slug: slug}
        })

        new_article = await this.prisma.article.update({
            where: {id: new_article.id},
            data: { slug: `${new_article.id}-${slug}` }
        })
        
        await this.prisma.articleHashTag.createMany({
            data: hashtagIds.map(hashtagId => ({ articleId: new_article.id, hashtagId: hashtagId }))
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
            const categoryIds = article.categories ?? []
            const tagIds = article.tags ?? []
            const hashtagIds = article.hashtags ?? []
            delete article.categories
            delete article.tags
            delete article.hashtags
            await this.prisma.article.update({
                where: {id: id}, data: {...article}
            })

            await this.prisma.articleHashTag.deleteMany({
                where: { articleId: id }
            })
            await this.prisma.articleHashTag.createMany({
                data: hashtagIds.map(hashtagId => ({ articleId: id, hashtagId: hashtagId }))
            })

            await this.prisma.articleTags.deleteMany({
                where: { articleId: id }
            })
            await this.prisma.articleTags.createMany({
                data: tagIds.map(tagId => ({ articleId: id, tagId: tagId }))
            })

            await this.prisma.articleCategories.deleteMany({
                where: { articleId: id }
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

    async userArticles(id, category_id) {
        const whereConditions = category_id ? {
            categories: {
                some: {
                    category: {
                        id: category_id
                    }
                }
            }
        } : {}
        const articles = await this.prisma.article.findMany({
            where: { 
                authorId: Number(id),
                ...whereConditions
            },
            orderBy: { id: "desc" },
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

        const total = await this.prisma.article.count({
            where: { 
                authorId: Number(id),
                ...whereConditions
            }
        })

        return {
            status: 200,
            total,
            articles
        }
    }
}
