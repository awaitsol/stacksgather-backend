import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PrismaService } from 'prisma/primsa.service';

@Module({
  controllers: [PageController],
  providers: [PageService, PrismaService],
})
export class PagesModule {}
