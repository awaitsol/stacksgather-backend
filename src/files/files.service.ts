import { InjectModel } from "@nestjs/mongoose";
import { Files } from "./file.schema";
import { Model } from "mongoose";
import { User } from "src/users/users.schema";
import { UsersServices } from "src/users/users.service";
import { PrismaService } from "prisma/primsa.service";

export class FilesService {

    constructor(
        @InjectModel(Files.name) private fileModel:Model<Files>,
        private prisma: PrismaService
    ) {}

    async uploadFile(file) {

        const new_file_data = {
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            destination: file.destination
        }
        
        const new_file = await this.prisma.file.create({
            data: new_file_data
        })

        return await new_file
    }

    async updateUserProfile(user_id, file_id) {
        // const user = await this.userModel.updateOne({_id: user_id}, {profile: file_id}).exec()
        // return user
    }
}