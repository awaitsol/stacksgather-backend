import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthService as authenticateService } from 'shared/services/auth-service';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, authenticateService, PrismaService]
})
export class AuthModule {}
