import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PageDocument = HydratedDocument<Page>

@Schema({
    timestamps: true
})

export class Page {
    @Prop()
    title: string

    @Prop()
    banner_image: string

    @Prop()
    short_description: string

    @Prop()
    description: string

    @Prop()
    slug: string

    @Prop()
    meta_description: string
}

export const PageSchema = SchemaFactory.createForClass(Page)