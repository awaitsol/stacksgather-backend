import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from 'src/articles/article.schema';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TagSchema } from 'src/tags/tag.schema';
import { PrismaService } from 'prisma/primsa.service';
import { CategorySchema } from 'src/categories/category.schema';
import { UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'Article', schema: ArticleSchema},
        { name: 'Tag', schema: TagSchema},
        { name: 'Category', schema: CategorySchema},
        { name: 'User', schema: UserSchema}
    ])
  ],
  controllers: [HomeController],
  providers: [HomeService, PrismaService],
})
export class HomeModule {}
