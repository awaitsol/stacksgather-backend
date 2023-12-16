import { Body, Controller, Get, Post, Req } from "@nestjs/common";
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
        console.log('req', req.hostname, req.body)
        return await this.userServices.create(req.body)
    }
}