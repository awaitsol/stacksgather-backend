import { Controller, Get, Param, Req } from "@nestjs/common";
import { HomeService } from "./home.service";

@Controller('home')
export class HomeController {
    constructor(private homeServices: HomeService) {}

    @Get()
    async findAll() {
        return await this.homeServices.get()
    }

    @Get('articles/search')
    async searchArticles(@Req() req) {
        return await this.homeServices.searchArticles(req.query)
    }

    @Get('tag/:id')
    async getTags(@Param('id') id, @Req() req) {
        return await this.homeServices.getTag(id)
    }

    @Get('store')
    async store() {
        return await this.homeServices.store()
    }

}