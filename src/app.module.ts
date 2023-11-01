import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: ".env",
    //   isGlobal: true
    // }),
    MongooseModule.forRoot('mongodb://localhost:27017/blogdb'),
    // CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
