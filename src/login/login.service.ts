import { Injectable } from '@nestjs/common';
import { AuthService } from 'shared/services/auth-service';
import * as bcrypt from "bcrypt"
import { PrismaService } from 'prisma/primsa.service';

@Injectable()
export class LoginService {
    constructor(
        private auth_service: AuthService,
        private prisma: PrismaService
    ) {}

    async login (body) {
        const {email, password} = body
        if(!email)
        {
            return {
                error: "Email is invalid"
            }
        }

        if(!password)
        {
            return {
                error: "Password is invalid"
            }
        }
        
        let user = await this.prisma.user.findFirst({
            where: {email: email}
        })

        if (user)
        {
            let checkpass = await bcrypt.compare(password, user.password)
            if(!checkpass)
            {
                return {
                    error: "Credentials are invalid!"
                } 
            }
            const {first_name, last_name, email} = user
            let token = await this.auth_service.auth_sign({first_name, last_name, email})
            return {
                status: 200,
                message: "loggedin successfully",
                user,
                token: token
            }
        }
        else
        {
            return {
                error: "Credentials are invalid!"
            }
        }
    }

    async verify (body) {
        const { token } = body
        let verified_user: any = await this.auth_service.auth_verification(token)
        const user = await this.prisma.user.findFirst({
            where: {email: verified_user.user?.email}
        })
        verified_user.user = user
        return verified_user
    }
}
