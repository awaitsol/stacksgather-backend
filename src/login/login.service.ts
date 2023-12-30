import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { lookupService } from 'dns';
import { Model } from 'mongoose';
import { AuthService } from 'shared/services/auth-service';
import { User } from 'src/users/users.schema';
import * as bcrypt from "bcrypt"

@Injectable()
export class LoginService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private auth_service: AuthService) {}

    async login (body) {
        const {email, password} = body
        if(!email)
        {
            return {
                error: "Email is invalid"
            }
        }

        if(!password)
        {
            return {
                error: "Password is invalid"
            }
        }
        
        let user = await this.userModel.findOne({email})
        if (user)
        {
            let checkpass = await bcrypt.compare(password, user.password)
            if(!checkpass)
            {
                return {
                    error: "Credentials are invalid!"
                } 
            }
            let token = await this.auth_service.auth_sign(user)
            return {
                status: 200,
                message: "loggedin successfully",
                user,
                token: token
            }
        }
        else
        {
            return {
                error: "Credentials are invalid!"
            }
        }
    }
}
