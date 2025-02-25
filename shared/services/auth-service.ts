import { sign, verify } from "jsonwebtoken"
import { SECRET_KEY } from "shared/constants"

export class AuthService {
    constructor() {}

    async auth_sign(payload, expiresIn = '7D') {
        return await sign(payload, process.env.SECRET_KEY, { expiresIn: expiresIn })
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