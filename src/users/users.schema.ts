import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({required: true})
    first_name: string

    @Prop({required: true})
    last_name: string

    @Prop({required: true, unique: true})
    email: string

    @Prop({required: true})
    password: string

    @Prop({required: true, default: 'admin'})
    role: 'admin' | 'user'

    @Prop({default: new Date()})
    createdAt: Date

    @Prop({default: new Date()})
    updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)