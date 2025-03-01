import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"
import { join } from 'path';
import * as fs from "fs-extra"
import { AuthService } from 'shared/services/auth-service';

@Injectable()
export class MailService {
    private transporter: Transporter

    constructor(private auth_service: AuthService) {
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

    private async compileTemplate(templateName: string, data: any): Promise<string> {
        const templatePath = join(__dirname, '../..', 'templates', `${templateName}.hbs`);
        const templateSource = await fs.readFile(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        return template(data);
    }

    async sendMail(to: string, subject: string) {
        try {
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
                status: 200,
                message: "mail successfully sent"
            };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
