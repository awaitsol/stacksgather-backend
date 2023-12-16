import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { lookupService } from 'dns';
import { Model } from 'mongoose';
import { AuthService } from 'shared/services/auth-service';
import { User } from 'src/users/users.schema';

@Injectable()
export class LoginService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private auth_service: AuthService) {}

    async login (body) {
        const {email, password} = body
        let user = await this.userModel.findOne({email, password})
        let token = await this.auth_service.auth_sign(user)
        if (user)
        {
            return {
                status: 200,
                message: "User loggedin successfully",
                user
            }
        }
        else
        {
            return {
                error: "user not exit"
            }
        }
    }
}
