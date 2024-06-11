import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './tag.schema';
import { Model } from 'mongoose';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
    tag: Tag,
    token?: string
}

@Injectable()
export class TagsService {
    constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>){}

    async findAll(): Promise<Tag[]> {
        return await this.tagModel.find().exec()
    }

    async find(body): Promise<Tag> {
        return await this.tagModel.findOne(body)
    }

    async save(tag: Tag): Promise<ReturnInterface> {
        const slug = tag.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        let new_tag = new this.tagModel({...tag, slug: slug})
        new_tag.save()
        return {
            status: 200,
            message: 'tag saved successfully.',
            tag: new_tag
        }
    }

    async update(tag: Tag, id: string): Promise<ReturnInterface> {
        const slug = tag.title.replace(/[^a-zA-Z]+/g, '-').toLowerCase();
        const _tag = await this.tagModel.findOneAndUpdate({_id: id}, {title: tag.title, slug: slug}, {returnDocument: "after"})
        return {
            status: 200,
            message: 'tag updated successfully.',
            tag: _tag
        }
    }

    async delete(id: string) {
        await this.tagModel.findOneAndDelete({_id: id})
        return {
            status: 200,
            message: 'tag deleted successfully'
        }
    }

    async getMultipleTagsById(ids: string[]) {
        const tags = await this.tagModel.find({_id: {
            $in: ids
        }}).exec()

        return {
            status: 200,
            tags: tags
        }
    }
}
