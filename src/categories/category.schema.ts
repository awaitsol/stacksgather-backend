import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>

@Schema({
    timestamps: true
})

export class Category {
    @Prop()
    title: string

    @Prop()
    thumbnail: string

    @Prop()
    parent_id: number

    @Prop()
    slug: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)