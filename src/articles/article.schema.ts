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
    image: string

    @Prop()
    parent_id: string
}

export const ArticleSchema = SchemaFactory.createForClass(Article)