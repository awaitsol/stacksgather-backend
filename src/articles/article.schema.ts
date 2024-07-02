import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Category } from "src/categories/category.schema";
import { Tag } from "src/tags/tag.schema";

export type ArticleDocument = HydratedDocument<Article>

@Schema({
    timestamps: true
})

export class Article {
    @Prop()
    title: string

    @Prop()
    thumbnail: string
    default: null

    @Prop()
    description: string

    @Prop({
        type: [{
            type: MongooseSchema.Types.ObjectId,
            ref: 'Category'
        }]
    })
    categories: Category[]

    @Prop({
        type: [{
            type: MongooseSchema.Types.ObjectId,
            ref: 'Tag'
        }]
    })
    tags: Tag[]
    

    @Prop()
    slug: string

    @Prop()
    meta_description: string
}

export const ArticleSchema = SchemaFactory.createForClass(Article)