import { Controller, Get, Param, Post, Req } from "@nestjs/common";
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

    @Post('write-for-us-quote')
    async SubmitWriteForUsQuote(@Req() req) {
        const { body } = req
        return await this.homeServices.SubmitWriteForUsQuote(body)
    }

    @Get('featured-categoies-with-articles')
    async featuredCategoriesWithArticles(@Req() req) {
        return await this.homeServices.featuredCategoriesWithArticles()
    }

    @Get('explore')
    async explore(@Req() req) {
        const { search } = req.query
        return await this.homeServices.explore(search)
    }
}