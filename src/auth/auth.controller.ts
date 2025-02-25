import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private autheService: AuthService) {}

    @Post('authenticate-register-email')
    async authenticateRegisterEmail(@Body() email: string) {
        return email;
    }
}
