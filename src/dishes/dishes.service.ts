import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dish, DishDocument } from '../schemas/dish.schema';
import { DishDto } from './dto/dish.dto';
import { createSlug } from '../utils/slug';
import { PaginationQueryDto } from '../dto/index.dto';
import { getSearchQuery } from '../utils/search';

const SEARCH_FIELDS = ['name', 'price'];

@Injectable()
export class DishesService {
  constructor(
    @InjectModel(Dish.name)
    private readonly dishModel: PaginateModel<DishDocument>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 12, sort = 'asc', search } = query;

    const options = getSearchQuery(SEARCH_FIELDS, search);
    return this.dishModel.paginate(
      {
        $or: options,
      },
      {
        sort: { created_at: sort === 'asc' ? 1 : -1 },
        limit,
        page,
      },
    );
  }

  async findById(id: string) {
    return this.dishModel.findById(id);
  }

  async findByIdOrFail(id: string) {
    return this.dishModel
      .findById(id)
      .orFail(new NotFoundException('Dish not found'));
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
