import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dish, DishDocument } from '../schemas/dish.schema';
import { DishDto } from './dto/dish.dto';
import { createSlug } from '../utils/slug';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish.name)
    private readonly dishModel: Model<DishDocument>,
  ) {}

  async findAll() {
    return this.dishModel.find();
  }

  async findById(id: string) {
    return this.dishModel.findById(id);
  }

  async findBySlug(slug: string) {
    return this.dishModel.findOne({ slug });
  }

  async save(dishDto: DishDto) {
    const { name, price, image } = dishDto;
    const slug = createSlug(name);

    if (await this.isSlugUsed(slug))
      throw new BadRequestException('The name has already been taken');

    return this.dishModel.create({
      name,
      slug,
      price,
      image,
    });
  }

  async update(id: string, dishDto: DishDto) {
    const { name, price, image } = dishDto;
    const slug = createSlug(name);

    if (await this.isSlugUsed(slug, id))
      throw new BadRequestException('The name has already been taken');

    return this.dishModel
      .findByIdAndUpdate(
        id,
        {
          name,
          slug,
          price,
          image,
        },
        {
          new: true,
        },
      )
      .orFail(new NotFoundException('Dish not found'));
  }

  async destroy(id: string) {
    return this.dishModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Dish not found'));
  }

  async isSlugUsed(slug: string, id?: string) {
    const dish = await this.findBySlug(slug);
    return id ? dish && dish._id.toString() !== id : !!dish;
  }
}
