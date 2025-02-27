import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/primsa.service';
import { AuthService as authenticateService } from 'shared/services/auth-service';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {

    private token: string

    constructor(
        private authenticateService: authenticateService,
        private prisma: PrismaService
    ) {}

    async setToken (data) {
        this.token = await this.authenticateService.auth_sign(data)
    }

    async verifyRegisterationToken(token: string) {
        const jwtPayload = await this.authenticateService.auth_verification(token)
        if(jwtPayload.status === 200)
        {
            const exist = await this.prisma.user.findFirst({
                where: {email: (jwtPayload.user as any).to}
            })
            if(!exist)
            {
                return jwtPayload
            }
        }

        return { status: 400, message: "User is not valid!" }
    }

    async signupAccount(user) {
        try {

            const exist = await this.prisma.user.findFirst({
                where: { email: user.email }
            })

            if(exist) return {
                status: 400,
                message: 'User is already exist!'
            }

            user.password = await bcrypt.hash(user.password, 12)
            const _user = await this.prisma.user.create({
                data: {...user, role: "USER"}
            })

            let token = await this.authenticateService.auth_sign({email: _user.email})
    
            return {
                status: 200,
                user: _user,
                token
            }
        } catch (error) {
            return {
                status: 400,
                message: error.message
            }
        }
    }

    async signInAccount(data) {
        const _user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
                role: 'USER'
            }
        })
        if(!_user) return {
            status: 400,
            message: 'Credentials are incorrect!'
        }

        const isUser = await bcrypt.compare(data.password, _user.password)
        if(!isUser)
        {
            return {
                status: 400,
                message: 'Credentials are incorrect!'
            }
        }

        this.setToken({email: _user.email})

        return { status: 200, user: _user, token: this.token }
    }

    async getVerifiedUser(token) {
        const jwtPayload = await this.authenticateService.auth_verification(token)
        const exist = await this.prisma.user.findFirst({
            where: {email: (jwtPayload.user as any).email}
        })

        if(exist) return {
            status: 200,
            user: exist
        }

        return {
            status: 400,
            user: null
        }
    }
}
