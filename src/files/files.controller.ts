import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("files")
export class FilesController {

    constructor(private readonly fileService: FilesService){}

    @Get(':filename')
    async getFile(@Param('filename') filename, @Res() res) {
        res.sendFile(filename, {root: './assets/uploads'})
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        return this.fileService.uploadFile(file)
    }
}