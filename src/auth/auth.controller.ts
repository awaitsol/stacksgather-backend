import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private autheService: AuthService) {}

    @Post('verify-token')
    async verifyToken(@Body() body) {
        const { token } = body
        const res = await this.autheService.verifyRegisterationToken(token)
        if(res.status == 400)
        {
            throw new Error(res.message)
        }
        return res
    }

    @Post('signup-account')
    async signupAccount(@Body() body) {
        return await this.autheService.signupAccount(body)
    }

    @Post('signin')
    async signIn(@Body() body) {
        return await this.autheService.signInAccount(body)
    }

    @Post('get-verified-user')
    async getVerifiedUser(@Body() body) {
        const { token } = body
        return await this.autheService.getVerifiedUser(token)
    }
}
