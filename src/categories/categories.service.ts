import { Injectable } from '@nestjs/common';
import { Category } from './category.schema';
import { IReturn } from 'shared/types';
import { PrismaService } from 'prisma/primsa.service';

interface ReturnInterface extends IReturn {
    category: any,
    token?: string
}

@Injectable()
export class CategoriesService {
    constructor(
        private prisma: PrismaService
    ){}

    async findAll(): Promise<Category[]> {
        return await this.prisma.category.findMany({
            orderBy: {
                id: "desc"
            }
        })
    }

    async find(filter): Promise<Category> {
        return await this.prisma.category.findFirst({
            where: filter,
            include: {
                articles: {
                    select: {
                        article: true
                    }
                }
            }
        })
    }

    async findMain(id: number, search?: string): Promise<Category[]> {

        const queryString = Number(search?.length ?? 0) > 0 ? {
            OR: [
                {
                    title: { contains: search }
                },
                {
                    slug: { contains: search }
                }
            ]
        } : {};

        return await this.prisma.category.findMany({
            where: {
                parent_id: id ? Number(id) : 0,
                ...queryString
            },
            include: {
              _count: {
                select: { articles: true }
              }
            },
            orderBy: {
                id: "desc"
            }
        });
    }

    async save(category: Category): Promise<ReturnInterface> {
        const slug = category.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();

        let new_category = await this.prisma.category.create({
            data: {
                ...category, slug: slug
            }
        })

        return {
            status: 200,
            message: 'category saved successfully.',
            category: new_category
        }
    }

    async update(category: Category, id: number): Promise<ReturnInterface> {
        const slug = category.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const _category = await this.prisma.category.update({
            where: { id: id },
            data: { thumbnail: category.thumbnail, title: category.title, parent_id: Number(category.parent_id), slug: slug }
        })

        return {
            status: 200,
            message: 'category updated successfully.',
            category: _category
        }
    }

    async delete(id: number) {
        await this.prisma.category.delete({
            where: {id: id}
        })
        
        return {
            status: 200,
            message: 'category deleted successfully'
        }
    }

    async userCategories(user_id: number) {
        return await this.prisma.category.findMany({
            where: {
                articles: {
                    some: {
                        article: {
                            authorId: Number(user_id)
                        }
                    }
                }
            }
        })
    }

    async getArticlesCategories() {
        return await this.prisma.articleCategories.findMany({
            include: {
                category: true
            }
        })
    }
}
