import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AuthService } from 'shared/services/auth-service';
import { PrismaService } from 'prisma/primsa.service';

@Module({
    controllers: [LoginController],
    providers: [LoginService, AuthService, PrismaService]
})
export class LoginModule {}
