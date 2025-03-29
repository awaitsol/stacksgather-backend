import { HttpStatus, Injectable } from '@nestjs/common';
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
        if(jwtPayload.status === HttpStatus.OK)
        {
            const exist = await this.prisma.user.findFirst({
                where: {email: (jwtPayload.user as any).to}
            })
            if(!exist)
            {
                return jwtPayload
            }
        }

        return { status: HttpStatus.BAD_REQUEST, message: "User is not valid!" }
    }

    // SignUp Function By Form
    async signupAccount(user) {
        try {

            const exist = await this.prisma.user.findFirst({
                where: { email: user.email }
            })

            if(exist) return {
                status: HttpStatus.BAD_REQUEST,
                message: 'User is already exist!'
            }

            user.password = await bcrypt.hash(user.password, 12)
            const _user = await this.prisma.user.create({
                data: {...user, role: "USER"}
            })

            await this.setToken({email: _user.email})
            return {
                status: HttpStatus.OK,
                user: _user,
                token: this.token
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    // SignUp Function By Google
    async signUpWithGoolge(data: any) {
        const exist = await this.prisma.user.findFirst({
            where: { email: data.email }
        })

        if(exist) return {
            status: HttpStatus.BAD_REQUEST,
            error: true,
            message: 'User already exist!',
            token: null,
            user: null
        }

        const user = await this.prisma.user.create({
            data: {...data, password: null, role: "USER", loginType: "GOOGLE"}
        })

        await this.setToken({email: user.email})
        return {
            status: HttpStatus.OK,
            user: user,
            token: this.token,
            error: false,
            message: 'Account successfully created.'
        }
    }

    // SignIn Function By Form
    async signInAccount(data) {
        const _user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
                role: 'USER'
            }
        })
        if(!_user) return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Credentials are incorrect!'
        }

        const isUser = await bcrypt.compare(data.password, _user.password)
        if(!isUser)
        {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Credentials are incorrect!'
            }
        }

        await this.setToken({email: _user.email})
        return { status: HttpStatus.OK, user: _user, token: this.token }
    }

    // SignIn Function By Google
    async loginWithGoolge(email: string) {
        const user = await this.prisma.user.findFirst({
            where: { email: email, role: 'USER' }
        })
        
        if(!user) return {
            status: HttpStatus.BAD_REQUEST,
            user: null,
            message: 'Kindly signup before login!'
        }
            
        await this.setToken({email: user.email})
        return {
            status: HttpStatus.OK,
            user: user,
            token: this.token
        }
    }

    async getVerifiedUser(token) {
        const jwtPayload = await this.authenticateService.auth_verification(token)
        const exist = await this.prisma.user.findFirst({
            where: {email: (jwtPayload.user as any).email}
        })

        if(exist) return {
            status: HttpStatus.OK,
            user: exist
        }

        return {
            status: HttpStatus.BAD_REQUEST,
            user: null
        }
    }

    async verifyResetPasswordToken({ token }) {
        const jwtPayload = await this.authenticateService.auth_verification(token)
        if(jwtPayload.status === HttpStatus.OK)
        {
            const exist = await this.prisma.user.findFirst({
                where: {email: (jwtPayload.user as any).to}
            })
            if(exist)
            {
                return {...jwtPayload, user: exist}
            }
        }

        return { status: HttpStatus.BAD_REQUEST, message: "Invalid Token!" }
    }

    async resetPassword({token, password}) {
        const jwtPayload = await this.authenticateService.auth_verification(token)
        if(jwtPayload.status === HttpStatus.OK)
        {
            const user = await this.prisma.user.findFirst({
                where: {email: (jwtPayload.user as any).to}
            })
            if(user)
            {
                const newPassword = await bcrypt.hash(password, 12);
                const new_user = await this.prisma.user.update({
                    where: {email: user.email},
                    data: {
                        password: newPassword
                    }
                })

                return { status: HttpStatus.OK, message: 'Password changed.', user: new_user }
            }
        }

        return { status: HttpStatus.BAD_REQUEST, message: "Invalid Token!" }
    }
}
