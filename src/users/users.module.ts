import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller";
import { UsersServices } from "./users.service";
import { AuthService } from "shared/services/auth-service";
import { PrismaService } from "prisma/primsa.service";

@Module({
    controllers: [UsersController],
    providers: [UsersServices, AuthService, PrismaService],
    exports: [UsersServices]
})

export class UsersModule {}