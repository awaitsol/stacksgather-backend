import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { UsersServices } from "src/users/users.service";

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

    @Post('/upload-profile-pic')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: 'assets/uploads/profile',
          filename: (req, file, cb) => {
            const fileNameArr = file.originalname.split('.')
            const fileName = `profile-${req.query.id}-${new Date().getTime()}.${fileNameArr[fileNameArr.length - 1]}`
            cb(null, fileName);
          },
        }),
    }), )
    async uploadUserProfile(@UploadedFile() file: any, @Req() req) {
        console.log('file', file)
        const picture_file = await this.fileService.uploadFile(file)
        return picture_file
    }
}