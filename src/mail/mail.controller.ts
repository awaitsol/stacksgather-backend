import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private mailService: MailService) {}

    @Post('verify-email')
    verifyRegistrationEmail (@Body() body) {
        return this.mailService.sendMail(body.to, body.subject)
    }

    @Post('forget-password')
    forgetPassword (@Body() body) {
        return this.mailService.sendForgetPasswordMail(body.email)
    }

    @Post('change-mail-address')
    changeMailAddress (@Body() body) {
        const { token, userId, new_email } = body
        return this.mailService.changeMailAddress(token, userId, new_email)
    }

    @Post('contact-form')
    contactForm (@Body() body) {
        const { name, email, phone, subject, message } = body
        return this.mailService.contactForm(name, email, phone, subject, message)
    }
}
