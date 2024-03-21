import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    LoginModule,
    CategoriesModule,
    TagsModule,
    FilesModule,
    ArticlesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
