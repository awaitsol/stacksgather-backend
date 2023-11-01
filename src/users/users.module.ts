import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller";
import { UsersServices } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./users.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'user',
                schema: UserSchema
            }
        ])
    ],
    controllers: [UsersController],
    providers: [UsersServices]
})

export class UsersModule {}