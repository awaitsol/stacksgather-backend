import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { IError, IReturn } from "shared/types"
import { AuthService } from "shared/services/auth-service"
import { PrismaService } from "prisma/primsa.service"

interface ReturnInterface extends IReturn {
    user: any,
    token?: string
}

@Injectable()
export class UsersServices {
    constructor(
        private auth_service: AuthService,
        private prisma: PrismaService
    ) {}

    async all(): Promise<any[]> {
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
                    role: "USER"
                }
            })

            let token = await this.auth_service.auth_sign(_user)
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
        await this.prisma.user.update({
            where: {
                id: id
            }, 
            data: user
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
}