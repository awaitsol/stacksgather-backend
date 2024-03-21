import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ArticleDocument = HydratedDocument<Article>

@Schema({
    timestamps: true
})

export class Article {
    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    categories: string[]

    @Prop()
    tags: string[]

    @Prop()
    slug: string
}

export const ArticleSchema = SchemaFactory.createForClass(Article)