import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CommentResponseDocument = HydratedDocument<CommentResponse>

@Schema({
    timestamps: true
})

export class CommentResponse {
    @Prop()
    userId: number

    @Prop()
    commentId: number

    @Prop()
    response: 'LIKE' | 'DISLIKE'

    @Prop()
    createdAt: Date
    
    @Prop()
    updatedAt: Date
}

export const CommentResponseSchema = SchemaFactory.createForClass(CommentResponse)