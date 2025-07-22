import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
import { UsersServices } from "./users.service";
import { IError, IReturn } from "shared/types";
import { User } from "@prisma/client";

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

    @Post('/generate-magic-link')
    async generteMagicLink(@Req() req) {
        return await this.userServices.generateMagicLink(req.body)
    }

    @Post('find-by-slug')
    async findBySlug(@Req() req) {
        const { slug } = req.body
        return await this.userServices.findBySlug(slug)
    }

    @Post('generate-slugs')
    async generateUserSlugs(@Req() req) {
        return await this.userServices.generateUserSlugs();
    }
}