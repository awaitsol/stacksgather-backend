import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { AuthService } from 'shared/services/auth-service';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [MailController],
  providers: [MailService, AuthService, PrismaService]
})
export class MailModule {}
