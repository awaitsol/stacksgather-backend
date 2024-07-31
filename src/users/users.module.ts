import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller";
import { UsersServices } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./users.schema";
import { AuthService } from "shared/services/auth-service";
import { PrismaService } from "prisma/primsa.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema
            }
        ])
    ],
    controllers: [UsersController],
    providers: [UsersServices, AuthService, PrismaService],
    exports: [UsersServices]
})

export class UsersModule {}