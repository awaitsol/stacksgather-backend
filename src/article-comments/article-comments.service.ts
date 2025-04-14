import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ArticleComments } from './article-comments.schema';
import { PrismaService } from 'prisma/primsa.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommentResponse } from './comment-response.schema';

@Injectable()
export class ArticleCommentsService {

  constructor( private prisma: PrismaService ){}

  async create(data: ArticleComments) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: data.userId }
      })

      if(!user)
      {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'User not exist.'
        }
      }

      const _d = await this.prisma.articleComment.create({
        data: {
          userId: data.userId,
          articleId: data.articleId,
          comments: data.comments,
          replyToId: data.replyToId ?? null
        }
      })
  
      return {
        status: HttpStatus.OK,
        data: {..._d, user: user}
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: e
      }
    }
  }

  async createResponse (data: CommentResponse) {
    try {

      const check = await this.prisma.commentResponse.findFirst({
        where: {
          userId: data.userId,
          commentId: data.commentId
        }
      })

      if(check)
      {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Already Respond!'
        }
      }

      const _d = await this.prisma.commentResponse.create({
        data: {
          userId: data.userId,
          commentId: data.commentId,
          response: data.response
        }
      })

      return {
        status: HttpStatus.OK,
        data: {..._d}
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: e
      }
    }
  }

  async removeResponse(data: Pick<CommentResponse, 'commentId' | 'userId'>) {
    try {
      const _res = await this.prisma.commentResponse.deleteMany({
        where: {
          userId: data.userId,
          commentId: data.commentId
        }
      })

      return {
        status: HttpStatus.OK,
        message: 'Deleted.'
      }
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: e
      }
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, data) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
