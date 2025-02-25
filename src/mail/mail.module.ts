import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { AuthService } from 'shared/services/auth-service';

@Module({
  controllers: [MailController],
  providers: [MailService, AuthService]
})
export class MailModule {}
