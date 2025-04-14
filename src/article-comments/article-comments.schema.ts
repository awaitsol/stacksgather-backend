import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ArticleCommentsDocument = HydratedDocument<ArticleComments>

@Schema({
    timestamps: true
})

export class ArticleComments {
    @Prop()
    userId: number

    @Prop()
    articleId: number

    @Prop()
    comments: string
    default: null

    @Prop()
    replyToId: number

    @Prop()
    createdAt: string
    
    @Prop()
    updatedAt: string

    // @Prop({
    //     type: [{
    //         type: MongooseSchema.Types.ObjectId,
    //         ref: 'Category'
    //     }]
    // })
    // categories: Category[]

    // @Prop({
    //     type: [{
    //         type: MongooseSchema.Types.ObjectId,
    //         ref: 'Tag'
    //     }]
    // })
    // tags: Tag[]
}

export const ArticleCommentsSchema = SchemaFactory.createForClass(ArticleComments)