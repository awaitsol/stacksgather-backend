import { sign, verify } from "jsonwebtoken"
import { SECRET_KEY } from "shared/constants"

export class AuthService {
    constructor() {}

    async auth_sign(payload) {
        const {first_name, last_name, email} = payload
        return await sign({first_name, last_name, email}, process.env.SECRET_KEY, {expiresIn: '7D'})
    }

    async auth_verification(token: string) {
        try {
            const res = await verify(token, process.env.SECRET_KEY)
            return {
                status: 200,
                message: "verified",
                user: res
            }
        }
        catch (e) {
            return {
                status: e.name,
                message: e.message
            }
        }
    }
}