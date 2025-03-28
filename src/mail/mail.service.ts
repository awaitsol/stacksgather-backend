import { HttpStatus, Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"
import { join } from 'path';
import * as fs from "fs-extra"
import { AuthService } from 'shared/services/auth-service';
import { PrismaService } from 'prisma/primsa.service';
import crypto from "crypto"

@Injectable()
export class MailService {
    private transporter: Transporter

    constructor(private auth_service: AuthService, private prisma: PrismaService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST_NAME,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        })
    }

    public async compileTemplate(templateName: string, data: any): Promise<string> {
        const templatePath = join(__dirname, '../..', 'templates', `${templateName}.hbs`);
        const templateSource = await fs.readFile(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        return template(data);
    }

    async sendMail(to: string, subject: string) {
        try {
            const exist = this.prisma.user.findFirst({
                where: {email: to}
            })

            if(exist)
            {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Email is already exist!"
                }
            }

            const jwtToken = await this.auth_service.auth_sign({ to });
            const verifyLink = `${process.env.WEBSITE_DOMAIN}/auth/signup?token=${jwtToken}`
            const htmlContent = await this.compileTemplate('register-mail', { to, verifyLink });
            const info = await this.transporter.sendMail({
                from: `"Stacks Gather" ${process.env.MAIL_USERNAME}`,
                to,
                subject,
                html: htmlContent,
            });
            
            return {
                status: HttpStatus.OK,
                message: "mail successfully sent"
            };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async sendForgetPasswordMail(email: string) {
        try {
            const user = await this.prisma.user.findFirst({
                where: { email: email }
            })
            
            if(!user)
            {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Email not found!"
                }
            }

            const jwtToken = await this.auth_service.auth_sign({ email }, '1D');
            const newPasswordLink = `${process.env.WEBSITE_DOMAIN}/auth/new-password?token=${jwtToken}`
            const htmlContent = await this.compileTemplate('forget-mail', {
                user,
                email,
                newPasswordLink,
                supportEmail: process.env.MAIL_USERNAME,
                year: (new Date()).getFullYear()
            });

            await this.transporter.sendMail({
                from: `"Stacks Gather" ${process.env.MAIL_USERNAME}`,
                to: email,
                subject: 'Reset Your StacksGather Password',
                html: htmlContent,
            });
            
            return {
                status: HttpStatus.OK,
                message: "Email successfully sent."
            };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async changeMailAddress(token: string, userId: number, new_email: string) {

        const verify_token = await this.auth_service.auth_verification(token)
        if(verify_token.status === 400)
        {
            return {
                status: HttpStatus.UNAUTHORIZED,
                message: 'User not authorized'
            }
        }

        const user = await this.prisma.user.findFirst({
            where: { id: userId }
        })
        const code = await (Math.floor(10000 + Math.random() * 90000)).toString();
        const htmlContent = await this.compileTemplate('change-email', {
            user,
            new_email,
            code,
            supportEmail: process.env.MAIL_USERNAME,
            year: (new Date()).getFullYear()
        })
        
        await this.transporter.sendMail({
            from: `"Stacks Gather" ${process.env.MAIL_USERNAME}`,
            to: new_email,
            subject: 'StacksGather - Verify Your New Email Address',
            html: htmlContent,
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                change_email_code: code
            }
        })
        
        return {
            status: HttpStatus.OK,
            message: "Email successfully sent."
        };
    }
}
