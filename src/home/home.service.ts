import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from 'src/articles/article.schema';
import { Tag } from 'src/tags/tag.schema';

@Injectable()
export class HomeService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<Article>, 
        @InjectModel(Tag.name) private tagModel: Model<Tag>
    ){}

    async get() {
        const articles = await this.articleModel.aggregate([
            {
                $lookup: {
                    from: "tags",
                    localField: "tags", // Use the individual customer_id
                    foreignField: "_id",
                    as: "tag_info"
                }
            },
            {
                $sort: { _id: -1 }
            }
        ])

        return {
            articles
        };
    }

    async getArticles() {
        const articles = await this.articleModel.aggregate([
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tag_info"
                }
            },
            {
                $sort: { _id: -1 }
            }
        ])
    
        return {
            articles
        };
    }

    async getTag(slug) {
        const tag = await this.tagModel.findOne({slug: slug})
        const articles = await this.articleModel.aggregate([
            {
                $match: {
                    tags: {
                        $in: [tag._id]
                    }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ])
    
        return {
            tag,
            articles
        };
    }
}