import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PrismaService } from 'prisma/primsa.service';
import { Article } from 'src/articles/article.schema';
import { Category } from 'src/categories/category.schema';
import { Tag } from 'src/tags/tag.schema';
import { User } from 'src/users/users.schema';

@Injectable()
export class HomeService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>, 
        @InjectModel(Tag.name) private tagModel: Model<Tag>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(User.name) private userModel: Model<User>,
        private prisma: PrismaService
    ){}

    async get() {

        const articles = await this.prisma.article.findMany({
            orderBy: { id: "desc" },
            take: 12,
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

        const featureCatSlug = await this.prisma.setting.findFirst({ where: { key: 'featured_list' } })

        const featuredArticles = await this.prisma.article.findMany({
            where: {
                categories: {
                    some: {
                        category: { slug: featureCatSlug.value }
                    }
                }
            },
            orderBy: { id: "desc" },
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

        return {
            featuredArticles, 
            articles
        };
    }

    async searchArticles(query: any = {}) {
        const { categoryId, queryString, take, skip } = query

        let whereClause: any = {
            OR: [
                {
                    categories: {
                        some: categoryId ? {
                            category: { title: { contains: queryString} },
                            categoryId: Number(categoryId)
                        } : {
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
                }
            ]
        }
        if(categoryId) whereClause.categories = { some: { categoryId: Number(categoryId) } }

        const articles = await this.prisma.article.findMany({
            orderBy: { id: "desc" },
            skip: Number(skip ?? 0),
            take: Number(take ?? 9),
            where: {
                ...whereClause,
            },
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
                },
            }
        });

        return articles;
    }

    async getTag(slug) {
        const tag = await this.prisma.tag.findFirst({
            where: {
                slug: slug
            },
            include: {
                articles: {
                    select: {
                        article: {
                            include: {
                                author: true,
                                categories: {
                                    select: {
                                        category: true
                                    }
                                },
                            }
                        }
                    }
                }
            }
        })
    
        return {
            tag
        };
    }

    async store() {
        const categories = await this.categoryModel.aggregate([{
            $project: {
                title: 1,
                parent_id: 1,
                thumbnail: 1,
                slug: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }])

        for(let i = 0; i < categories.length; i++)
        {
            let category = categories[i]
            
            const parentCat = (category.parent_id && category.parent_id !== '0') ? await this.categoryModel.findOne({_id: new Types.ObjectId(category.parent_id)}) : null
            const parentBySlug = parentCat ? await this.prisma.category.findFirst({where: {slug: parentCat.slug}}) : null

            const existCat = await this.prisma.category.findFirst({where: {slug: category.slug}})
            if(!existCat)
            {
                let newResult = await this.prisma.category.create({
                    data: {
                        title: category.title,
                        thumbnail: category.thumbnail,
                        parent_id: parentBySlug ? parentBySlug.id : null,
                        slug: category.slug,
                        createdAt: category.createdAt,
                        updatedAt: category.updatedAt
                    }
                })
            }
        }

        return {
            categories
        };
    }

    async SubmitWriteForUsQuote(data) {
        try{
            const record = await this.prisma.writeForUsQuote.create({
                data: {...data, topicId: Number(data.topicId)}
            })
    
            return {
                status: HttpStatus.OK,
                record
            }
        } catch(e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: e.message
            }
        }
    }
}