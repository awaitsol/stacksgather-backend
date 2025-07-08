import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/primsa.service';
import { AuthService } from 'shared/services/auth-service';
import * as bcrypt from "bcrypt"
@Injectable()
export class SettingsService {

    constructor(private auth_service: AuthService, private prisma: PrismaService) {}

    async changeEmail(token, code, email) {
        const verifyToken = await this.auth_service.auth_verification(token)
        if(verifyToken.status !== 200) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Unauthorized token."
            }
        }
        const user = await this.prisma.user.findFirst({
            where: { change_email_code: code }
        })

        if(!user) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "User not found."
            }
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { email: email, change_email_code: '' }
        })

        return {
            status: HttpStatus.OK,
            message: "Email changed successfully."
        }
    }

    async connectWithGoogle(token: string, email: string) {
        const verifyToken = await this.auth_service.auth_verification(token)
        if(verifyToken.status !== 200) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Unauthorized token."
            }
        }

        const user = await this.prisma.user.update({
            where: { email: (verifyToken.user as any)?.email },
            data: { connect_google: email }
        })

        return {
            status: HttpStatus.OK,
            user: user
        }

    }

    async setNewPassword(token: string, newPassword: string) {
        const verifyToken = await this.auth_service.auth_verification(token)
        if(verifyToken.status !== 200) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Unauthorized token."
            }
        }
        const newPass = await bcrypt.hash(newPassword, 12)
        const user = await this.prisma.user.update({
            where: { email: (verifyToken.user as any)?.email },
            data: { password: newPass }
        })

        return {
            status: HttpStatus.OK,
            user: user
        }
    }

    async saveHomePageSetting(data) {
        let keyRecord = await this.prisma.setting.findFirst({
            where: {
                key: data.key
            }
        })

        if(!keyRecord) {
            keyRecord = await this.prisma.setting.create({
                data: {
                    key: data.key,
                    value: data.value
                }
            })
        } else {
            keyRecord = await this.prisma.setting.update({
                where: { id: keyRecord.id },
                data: { value: data.value }
            })
        }

        return {
            status: HttpStatus.OK,
            setting: keyRecord
        }
    }
}
