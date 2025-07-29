import { HttpStatus, Injectable } from '@nestjs/common';
import { IReturn } from 'shared/types';
import { PrismaService } from 'prisma/primsa.service';
import { Tag } from '@prisma/client';

interface ReturnInterface extends IReturn {
    tag: any,
    token?: string
}

@Injectable()
export class TagsService {
    constructor(
        private prisma: PrismaService
    ){}

    async findAll(search?: string): Promise<any[]> {
        const queryString = search?.length > 0 ? {
            OR: [
                {
                    title: { contains: search }
                },
                {
                    slug: { contains: search }
                }
            ]
        } : {};

        return await this.prisma.tag.findMany({
            where: { ...queryString },
            orderBy: {
                id: "desc"
            }
        });
    }

    async find(body): Promise<any> {
        return await this.prisma.tag.findFirst({where: body});
    }

    async save(tag: any): Promise<ReturnInterface> {
        const slug = tag.title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

        let new_tag = await this.prisma.tag.create({
            data: {
                ...tag, slug: slug
            }
        });

        return {
            status: 200,
            message: 'tag saved successfully.',
            tag: new_tag
        };
    }

    async update(tag: any, id: number): Promise<ReturnInterface> {
        const slug = tag.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const _tag = await this.prisma.tag.update({
            where: {
                id: id
            },
            data: {title: tag.title, slug: slug}
        })

        return {
            status: 200,
            message: 'tag updated successfully.',
            tag: _tag
        }
    }

    async delete(id: number) {
        
        await this.prisma.tag.delete({
            where: { id: id }
        })

        return {
            status: 200,
            message: 'tag deleted successfully'
        }
    }

    async getMultipleTagsById(ids: number[]) {
        const tags = await this.prisma.tag.findMany({
            where: {
                id: { in: ids }
            }
        })

        return {
            status: 200,
            tags: tags
        }
    }

    async getMostlyUsedTags() {
        const tags = await this.prisma.tag.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                _count: {
                    select: {
                        articles: true
                    }
                }
            },
            orderBy: {
                articles: {
                    _count: "desc"
                }
            },
            take: 20
        })

        return {
            status: 200,
            tags: tags
        }
    }

    async moveToHashTag(data: Tag) {
        const articleTags = await this.prisma.articleTags.findMany({
            where: {
                tagId: data.id
            }
        })

        for(let i = 0; i < articleTags.length; i++) {
            const hashtag = await this.prisma.hashTag.create({
                data: {
                    title: data.title,
                    slug: data.slug
                }
            })

            await this.prisma.articleHashTag.create({
                data: {
                    articleId: articleTags[i].articleId,
                    hashtagId: hashtag.id
                }
            })
        }

        await this.prisma.articleTags.deleteMany({
            where: {
                tagId: data.id
            }
        })

        await this.prisma.tag.delete({
            where: {
                id: data.id
            }
        })

        return {
            status: HttpStatus.OK,
            message: "Tag changed to hashtag."
        }
    }
}
