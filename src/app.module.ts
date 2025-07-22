import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import { PagesModule } from './pages/page.module';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SettingsModule } from './settings/settings.module';
import { ArticleCommentsModule } from './article-comments/article-comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    UsersModule,
    LoginModule,
    CategoriesModule,
    TagsModule,
    FilesModule,
    ArticlesModule,
    PagesModule,
    HomeModule,
    AuthModule,
    MailModule,
    SettingsModule,
    ArticleCommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
