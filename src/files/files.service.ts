import { PrismaService } from "prisma/primsa.service";

export class FilesService {

    constructor(
        private prisma: PrismaService
    ) {}

    async uploadFile(file) {

        const new_file_data = {
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            destination: file.destination
        }

        const prisma = new PrismaService()
        const new_file = await prisma.file.create({
            data: new_file_data
        })

        return new_file
    }
}