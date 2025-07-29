import { Injectable } from "@nestjs/common";
import { HashTag } from "@prisma/client";
import { PrismaService } from "prisma/primsa.service";
import { IReturn } from "shared/types";

interface ReturnInterface extends IReturn {
    hashtag: HashTag,
    token?: string
}

@Injectable()
export class HashtagService {
    constructor(private prisma: PrismaService) {}

    async findAll(search?: string): Promise<HashTag[]> {
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

        return await this.prisma.hashTag.findMany({
            where: { ...queryString },
            orderBy: {
                id: "desc"
            }
        });
    }

    async find(body): Promise<any> {
        return await this.prisma.hashTag.findFirst({where: body});
    }

    async save(hashtag: HashTag): Promise<ReturnInterface> {
        const slug = hashtag.title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

        let new_hashtag = await this.prisma.hashTag.create({
            data: {
                ...hashtag, slug: slug
            }
        });

        return {
            status: 200,
            message: 'tag saved successfully.',
            hashtag: new_hashtag
        };
    }

    async update(hashtag: HashTag, id: number): Promise<ReturnInterface> {
        const slug = hashtag.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const _tag = await this.prisma.hashTag.update({
            where: {
                id: id
            },
            data: {title: hashtag.title, slug: slug}
        })

        return {
            status: 200,
            message: 'tag updated successfully.',
            hashtag: _tag
        }
    }

    async delete(id: number) {
        
        await this.prisma.hashTag.delete({
            where: { id: id }
        })

        return {
            status: 200,
            message: 'tag deleted successfully'
        }
    }
}