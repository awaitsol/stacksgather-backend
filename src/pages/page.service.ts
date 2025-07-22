import { Injectable } from '@nestjs/common';
import { IReturn } from 'shared/types';
import { PrismaService } from 'prisma/primsa.service';
import { Page } from '@prisma/client';

interface ReturnInterface extends IReturn {
    article: Page,
    token?: string
}

@Injectable()
export class PageService {
    constructor(
        private prisma: PrismaService
    ){}

    async findAll(): Promise<Page[]> {
        return await this.prisma.page.findMany()
    }

    async findOne(slug: string): Promise<Page> {
        return await this.prisma.page.findFirst({
            where: {
                slug: slug
            }
        })
    }

    async save(page: Page): Promise<ReturnInterface> {
        const slug = page.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const new_page = await this.prisma.page.create({
            data: {...page, slug: slug}
        })
        
        return {
            status: 200,
            message: 'Page saved successfully.',
            article: new_page
        }
    }

    async update(page: Page, id: string): Promise<IReturn> {
        const slug = page.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        await this.prisma.page.update({
            where: {
                id: Number(id)
            },
            data: {...page, slug: slug}
        })
        return {
            status: 200,
            message: 'Page updated successfully.',
        }
    }

    async delete(id: string) {
        await this.prisma.page.delete({
            where: {
                id: Number(id)
            }
        })
        return {
            status: 200,
            message: 'Page deleted successfully'
        }
    }
}
