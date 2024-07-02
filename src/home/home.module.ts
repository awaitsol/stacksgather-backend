import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from 'src/articles/article.schema';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TagSchema } from 'src/tags/tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: 'Article', schema: ArticleSchema},
        { name: 'Tag', schema: TagSchema}
    ])
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
