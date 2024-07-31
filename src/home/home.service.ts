import { Injectable } from '@nestjs/common';
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
        // const articles = await this.articleModel.aggregate([
        //     {
        //         $lookup: {
        //             from: "tags",
        //             localField: "tags", // Use the individual customer_id
        //             foreignField: "_id",
        //             as: "tag_info"
        //         }
        //     },
        //     {
        //         $sort: { _id: -1 }
        //     },
        //     { $limit: 10 }
        // ])

        const articles = await this.prisma.article.findMany({
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

        return {
            articles
        };
    }

    async getArticles() {
        const articles = await this.prisma.article.findMany({
            include: {
                categories: {
                    select: {
                        category: true
                    }
                }
            }
        })
    
        return {
            articles
        };
    }

    async getTag(slug) {
        const tag = await this.prisma.tag.findFirst({
            where: {
                slug: slug
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
            console.log('category', category)
            const parentCat = (category.parent_id && category.parent_id !== '0') ? await this.categoryModel.findOne({_id: new Types.ObjectId(category.parent_id)}) : null
            const parentBySlug = parentCat ? await this.prisma.category.findFirst({where: {slug: parentCat.slug}}) : null

            const existCat = await this.prisma.category.findFirst({where: {slug: category.slug}})
            if(!existCat)
            {
                console.log('parentBySlug', parentBySlug)
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
}