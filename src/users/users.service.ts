import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { IError, IReturn } from "shared/types"
import { AuthService } from "shared/services/auth-service"
import { PrismaService } from "prisma/primsa.service"
import { User } from "@prisma/client"

interface ReturnInterface extends IReturn {
    user: User,
    token?: string
}

@Injectable()
export class UsersServices {
    constructor(
        private auth_service: AuthService,
        private prisma: PrismaService
    ) {}

    async all(): Promise<User[]> {
        let users = await this.prisma.user.findMany()
        return users
    }

    async create(user: any): Promise<ReturnInterface | IError> {
        try{
            let checkuser = await this.prisma.user.findFirst({where: {email: user.email}})
            if(checkuser)
            {
                return {
                    status: 401,
                    error: {
                        message: 'email already exist'
                    }
                }
            }
                
            user.password = await bcrypt.hash(user.password, 12)
            const _user = await this.prisma.user.create({
                data: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    password: user.password,
                    profile: user.profile,
                    role: "STAFF"
                }
            })

            const {first_name, last_name, email} = _user
            let token = await this.auth_service.auth_sign({first_name, last_name, email})
            return {
                status: 200,
                message: "User created successfully",
                user: _user,
                token: token
            }
        }
        catch (err) {
            let _er = JSON.stringify(err)
            throw new HttpException('server error found: ' + _er, HttpStatus.BAD_REQUEST)
        }
    }

    async update(user: any, id: number) {
        let slug = this.slugify(`${user.id} ${user.first_name} ${user.last_name}`)
        await this.prisma.user.update({
            where: {
                id: id
            }, 
            data: {...user, slug}
        })
        return {
            status: 200,
            message: 'user updated successfully.',
        }
    }

    async changePassword(data) {
        const { token, password, new_password } = data
        let verified_user: any = await this.auth_service.auth_verification(token)

        if(verified_user.status !== 200)
        {
            return {
                status: 401,
                message: verified_user.message
            }
        }

        const user = await this.prisma.user.findFirst({
            where: { email: verified_user.user.email }
        })

        let checkpass = await bcrypt.compare(password, user.password)

        if(checkpass)
        {
            let new_password_hash = await bcrypt.hash(new_password, 12)

            await this.prisma.user.update({
                where: {email: verified_user.user.email},
                data: {
                    password: new_password_hash
                }
            })

            return {
                status: 200,
                message: 'Password changed successfully.'
            }
        }
        else {
            return {
                status: 401,
                message: 'Current password is in-valid.'
            }
        }
    }

    async generateMagicLink(body) {
        const { email } = body
        let token = await this.auth_service.auth_sign({ email })
        return {
            status: 200,
            token: token
        }
    }

    async findBySlug(slug) {
        const user = await this.prisma.user.findFirst({
            where: {
                slug: slug
            }
        })

        if(!user) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: ' Request not valid!'
            }
        }

        return {
            status: 200,
            user
        }
    }

    slugify = (title) => {
        return title
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')               // Replace & with 'and'
            .replace(/[^a-z0-9\s-]/g, '')       // Remove special characters
            .replace(/\s+/g, '-')               // Replace spaces with hyphens
            .replace(/-+/g, '-');               // Replace multiple hyphens with one
    };

    async generateUserSlugs() {
        const users = await this.prisma.user.findMany();

        for(let i = 0; i < users.length; i++) {
            let user = users[i]
            const slug = this.slugify(`${user.id} ${user.first_name} ${user.last_name}`)
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: { slug: slug }
            })
        }
    }
}