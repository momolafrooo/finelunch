import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from '../schemas/restaurant.schema';
import { createSlug } from '../utils/slug';
import { RestoDto } from './dto/restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async findAll() {
    return this.restaurantModel.find();
  }

  async findById(id: string) {
    return this.restaurantModel.findById(id);
  }

  async findBySlug(slug: string) {
    return this.restaurantModel.findOne({ slug });
  }

  async findByPhone(phone: string) {
    return this.restaurantModel.findOne({ phone });
  }

  async save(restoDto: RestoDto) {
    const { name, phone, image } = restoDto;
    const slug = createSlug(name);

    if (await this.isSlugUsed(slug))
      throw new BadRequestException('The name has already been taken');

    if (await this.isPhoneUsed(phone))
      throw new BadRequestException('The phone number has already been taken');

    return this.restaurantModel.create({
      name,
      slug,
      phone,
      image,
    });
  }

  async update(id: string, restoDto: RestoDto) {
    const { name, phone, image } = restoDto;
    const slug = createSlug(name);

    if (await this.isSlugUsed(slug, id))
      throw new BadRequestException('The name has already been taken');

    if (await this.isPhoneUsed(phone, id))
      throw new BadRequestException('The phone number has already been taken');

    return this.restaurantModel.findByIdAndUpdate(id, {
      name,
      slug,
      phone,
      image,
    });
  }

  async destroy(id: string) {
    return this.restaurantModel.findByIdAndDelete(id);
  }

  async isSlugUsed(slug: string, id?: string) {
    const resto = await this.findBySlug(slug);
    return id ? resto && resto._id.toString() !== id : !!resto;
  }

  async isPhoneUsed(phone: string, id?: string) {
    const resto = await this.findByPhone(phone);
    return id ? resto && resto._id.toString() !== id : !!resto;
  }
}
