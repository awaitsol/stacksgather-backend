import { sign, verify } from "jsonwebtoken"
import { StringValue } from "ms"
import { SECRET_KEY } from "shared/constants"

type expiresInType = StringValue | number

export class AuthService {
    constructor() {}

    async auth_sign(payload: any, expiresIn: expiresInType = '7D'): Promise<string> {
        return await sign(payload, process.env.SECRET_KEY, { expiresIn: (expiresIn as expiresInType) })
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