import { Controller, Get, Post, Body } from "@nestjs/common";
import { UsersServices } from "./users.service";
import { User } from "./users.schema";

interface ReturnInterface {
    status: number
    message: string
    user: User
}

@Controller('users')
export class UsersController {
    constructor(private userServices: UsersServices) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.userServices.all()
    }

    @Post()
    async save(req, res): Promise<ReturnInterface> {
        return await this.userServices.create(req.body)
    }
}