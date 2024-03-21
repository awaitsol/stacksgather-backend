import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
import { UsersServices } from "./users.service";
import { User } from "./users.schema";
import { IError, IReturn } from "shared/types";

interface ReturnInterface extends IReturn {
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
    async save(@Req() req, res): Promise<ReturnInterface | IError> {
        return await this.userServices.create(req.body)
    }

    @Put()
    async update(@Req() req, res): Promise<IReturn | IError> {
        return await this.userServices.update(req.body.user, req.body.id)
    }

    @Post('/change-password')
    async changePassword(@Req() req) {
        return await this.userServices.changePassword(req.body)
    }
}