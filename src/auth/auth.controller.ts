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
    async getVerifiedUser(@Req() req) {
        const { token } = req.body
        return await this.autheService.getVerifiedUser(token)
    }

    @Post('google-signin')
    async loginWithGoolge(@Body() body) {
        const { email } = body
        return await this.autheService.loginWithGoolge(email)
    }

    @Post('google-signup')
    async signUpWithGoolge(@Body() body) {
        return await this.autheService.signUpWithGoolge(body)
    }

    @Post('reset-password-verify-token')
    async verifyResetPasswordToken(@Body() body) {
        return await this.autheService.verifyResetPasswordToken(body)
    }

    @Post('reset-password')
    async resetPassword(@Body() body) {
        return await this.autheService.resetPassword(body)
    }
}
