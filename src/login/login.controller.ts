import { Controller, Post, Req } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Post()
    async login (@Req() req, res) {
        return this.loginService.login(req.body)
    }
}
