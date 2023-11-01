import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserDocument } from "./users.schema"
import { Model } from "mongoose"

interface ReturnInterface {
    status: number
    message: string
    user: User
}

@Injectable()
export class UsersServices {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async all(): Promise<User[]> {
        let users = await this.userModel.find().exec()
        return users
    }

    async create(user: User): Promise<ReturnInterface> {
        const userData = new this.userModel(user)
        let _user = await userData.save()

        return {
            status: 200,
            message: "User created successfully",
            user: _user
        }
    }
}