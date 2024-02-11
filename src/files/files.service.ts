import { InjectModel } from "@nestjs/mongoose";
import { Files } from "./file.schema";
import { Model } from "mongoose";

export class FilesService {

    constructor(@InjectModel(Files.name) private fileModel:Model<Files>) {}

    async uploadFile(file) {

        const new_file_data = {
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
        }

        const new_file = new this.fileModel(new_file_data)

        return await new_file.save()
    }
}