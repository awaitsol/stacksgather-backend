import { Controller, Get, Param, Req } from "@nestjs/common";
import { HomeService } from "./home.service";

@Controller('home')
export class HomeController {
    constructor(private homeServices: HomeService) {}

    @Get()
    async findAll() {
        return await this.homeServices.get()
    }

    @Get('articles/search/:queryString?')
    async searchArticles(@Param('queryString') queryString: string, @Req() req) {
        return await this.homeServices.searchArticles(queryString, req.query)
    }

    @Get('articles-by-category/:id')
    async getArticles(@Param('id') id: string, @Req() req) {
        return await this.homeServices.getArticlesByCategoryId(id)
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