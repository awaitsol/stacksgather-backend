import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { IReturn } from 'shared/types';

interface ReturnInterface extends IReturn {
    category: Category,
    token?: string
}

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>){}

    async findAll(): Promise<Category[]> {
        return await this.categoryModel.find().exec()
    }

    async findMain(id: string): Promise<Category[]> {
        let query = id ? { parent_id: id} : {$or: [{ parent_id : { $exists: false } }, { parent_id: "" } ]}
        return await this.categoryModel.find(query).exec()
    }

    async save(category: Category): Promise<ReturnInterface> {
        let new_category = new this.categoryModel(category)
        new_category.save()
        return {
            status: 200,
            message: 'category saved successfully.',
            category: new_category
        }
    }

    async update(category: Category, id: string): Promise<IReturn> {
        let new_category = await this.categoryModel.updateOne({_id: id}, category).exec()
        return {
            status: 200,
            message: 'category updated successfully.',
        }
    }

    async delete(id: string) {
        await this.categoryModel.findOneAndDelete({_id: id})
        return {
            status: 200,
            message: 'category deleted successfully'
        }
    }
}
