import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AuthService } from 'shared/services/auth-service';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, AuthService, PrismaService]
})
export class SettingsModule {}
