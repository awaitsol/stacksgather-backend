import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/primsa.service';

@Injectable()
export class HomeService {

    constructor(
        private prisma: PrismaService
    ){}

    async get() {

        const articles = await this.prisma.article.findMany({
            orderBy: { id: "desc" },
            take: 12,
            where: { status: "ACTIVE" },
            include: {
                author: true,
                categories: {
                    select: {
                        category: true
                    }
                },
                tags: {
                    select: {
                        tag: true
                    }
                }
            }
        })

        const featureCatSlug = await this.prisma.setting.findFirst({ where: { key: 'featured_list' } })

        const featuredArticles = await this.prisma.article.findMany({
            where: {
                status: "ACTIVE",
                categories: {
                    some: {
                        category: { slug: featureCatSlug.value }
                    }
                }
            },
            orderBy: { id: "desc" },
            include: {
                author: true,
                categories: {
                    select: {
                        category: true
                    }
                },
                tags: {
                    select: {
                        tag: true
                    }
                }
            }
        })

        return {
            featuredArticles, 
            articles
        };
    }

    async searchArticles(query: any = {}) {
        const { authorId, categoryId, queryString, take, skip } = query

        let whereClause: any = {
            status: "ACTIVE"
        }
        if(queryString) {
            whereClause.OR = [
                {
                    categories: {
                        some: categoryId ? {
                            category: { title: { contains: queryString} },
                            categoryId: Number(categoryId)
                        } : {
                            category: { title: { contains: queryString} },
                        }
                    }
                },
                {
                    tags: { 
                        some: { 
                            tag: { title: { contains: queryString } }
                        }
                    }
                },
                {
                    title: { contains: queryString }
                },
                {
                    slug: { contains: queryString }
                }
            ]
        }
        if(authorId) {
            whereClause.authorId = Number(authorId)
        }

        if(categoryId) whereClause.categories = { some: { categoryId: Number(categoryId) } }

        let articleQueryObj: any = {
            orderBy: [
                { isFeatured: "desc" },
                { id: "desc" }
            ],
            where: whereClause,
            include: {
                author: true,
                tags: {
                    select: {
                        tag: true
                    }
                },
                categories: {
                    select: {
                        category: true
                    }
                }
            }
        }

        const total = await this.prisma.article.count({ where: whereClause })

        if(skip) {
            articleQueryObj.skip = Number(skip)
        }

        if(take) {
            articleQueryObj.take = Number(take)
        }

        const articles = await this.prisma.article.findMany(articleQueryObj);

        return {
            total: total,
            articles: articles
        };
    }

    async getTag(slug) {
        const tag = await this.prisma.tag.findFirst({
            where: {
                slug: slug
            },
            include: {
                articles: {
                    select: {
                        article: {
                            include: {
                                author: true,
                                categories: {
                                    select: {
                                        category: true
                                    }
                                },
                            }
                        }
                    }
                }
            }
        })
    
        return {
            tag
        };
    }

    async store() {
        const categories = await this.prisma.category.findMany()

        for(let i = 0; i < categories.length; i++)
        {
            let category = categories[i]
            
            const parentCat = (category.parent_id && category.parent_id !== 0) ? await this.prisma.category.findFirst({ where: {id: category.parent_id} }) : null

            const parentBySlug = parentCat ? await this.prisma.category.findFirst({where: {slug: parentCat.slug}}) : null

            const existCat = await this.prisma.category.findFirst({where: {slug: category.slug}})
            if(!existCat)
            {
                let newResult = await this.prisma.category.create({
                    data: {
                        title: category.title,
                        thumbnail: category.thumbnail,
                        parent_id: parentBySlug ? parentBySlug.id : null,
                        slug: category.slug,
                        createdAt: category.createdAt,
                        updatedAt: category.updatedAt
                    }
                })
            }
        }

        return {
            categories
        };
    }

    async SubmitWriteForUsQuote(data) {
        try{
            const record = await this.prisma.writeForUsQuote.create({
                data: {...data, topicId: Number(data.topicId)}
            })
    
            return {
                status: HttpStatus.OK,
                record
            }
        } catch(e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: e.message
            }
        }
    }

    async featuredCategoriesWithArticles() {
        try{
            const data = await this.prisma.category.findMany({
                where: {
                    featured: true
                },
                include: {
                    articles: {
                        take: 6,
                        where: {
                            article: {
                                status: "ACTIVE"
                            }
                        },
                        include: {
                            article: {
                                include: {
                                    author: true,
                                    tags: {
                                        select: {
                                            tag: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: {
                            article: {
                                id: "desc"
                            }
                        }
                    }
                }
            })

            return {
                status: HttpStatus.OK,
                data
            }
        } catch(e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: e.message
            }
        }
    }

    async explore(search: string) {
        try {
            if (!search || search.trim() === '') {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Search query is required'
                }
            }

            const searchQuery = search.trim()

            // Search categories
            const categories = await this.prisma.category.findMany({
                where: {
                    status: "ACTIVE",
                    OR: [
                        { title: { contains: searchQuery } },
                        { slug: { contains: searchQuery } },
                        { description: { contains: searchQuery } }
                    ]
                },
                take: 10,
                orderBy: { id: "desc" }
            })

            // Search articles
            const articles = await this.prisma.article.findMany({
                where: {
                    status: "ACTIVE",
                    OR: [
                        { title: { contains: searchQuery } },
                        { slug: { contains: searchQuery } },
                        { short_description: { contains: searchQuery } },
                        { meta_description: { contains: searchQuery } }
                    ]
                },
                take: 10,
                orderBy: [
                    { isFeatured: "desc" },
                    { id: "desc" }
                ],
                include: {
                    author: true,
                    categories: {
                        select: {
                            category: true
                        }
                    },
                    tags: {
                        select: {
                            tag: true
                        }
                    }
                }
            })

            // Search users
            const users = await this.prisma.user.findMany({
                where: {
                    status: "ACTIVE",
                    OR: [
                        { first_name: { contains: searchQuery } },
                        { last_name: { contains: searchQuery } },
                        { email: { contains: searchQuery } },
                        { slug: { contains: searchQuery } }
                    ]
                },
                take: 10,
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    profile: true,
                    slug: true,
                    role: true
                }
            })

            return {
                status: HttpStatus.OK,
                data: {
                    categories,
                    articles,
                    users
                }
            }
        } catch(e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: e.message
            }
        }
    }

    async subscribeEmail(email: string) {
        try {
            const create_subscribe = await this.prisma.subscription.create({
                data: {
                    email: email
                }
            })

            return {
                status: HttpStatus.OK,
                data: create_subscribe
            }
        } catch(e) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: e.message
            }
        }
    }
}