import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AuthService } from 'shared/services/auth-service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/users.schema';
import { PrismaService } from 'prisma/primsa.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema
            }
        ])
    ],
    controllers: [LoginController],
    providers: [LoginService, AuthService, PrismaService]
})
export class LoginModule {}
