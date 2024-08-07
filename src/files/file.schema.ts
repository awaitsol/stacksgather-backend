import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class Files {
    @Prop()
    originalName: string

    @Prop()
    fileName: string

    @Prop()
    mimeType: string

    @Prop()
    size: Number

    @Prop()
    destination: string
}

export const FilesSchema = SchemaFactory.createForClass(Files)