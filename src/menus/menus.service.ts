import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { createSlug } from '../utils/slug';
import { MenuDto } from './dto/menu.dto';
import { DishesService } from '../dishes/dishes.service';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private readonly menuModel: Model<MenuDocument>,
    @Inject('DISH_SERVICE')
    private readonly dishService: DishesService,
  ) {}

  async findAll() {
    return this.menuModel.find();
  }

  async findById(id: string) {
    return this.menuModel.findById(id);
  }

  async findBySlug(slug: string) {
    return this.menuModel.findOne({ slug });
  }

  async save(menuDto: MenuDto) {
    const { name, image, dishes } = menuDto;
    const slug = createSlug(name);

    if (await this.isSlugUsed(slug))
      throw new BadRequestException('The name has already been taken');

    const newDishes = dishes.map(async (dish) => {
      const dishFound = await this.dishService.findById(dish.id);
      if (!dishFound) throw new NotFoundException('Dish not found');
      dishFound.price = dish.price;
      return dishFound;
    });

    return this.menuModel.create({
      name,
      slug,
      image,
      dishes: newDishes,
    });
  }

  async update(id: string, menuDto: MenuDto) {
    const { name, image, dishes } = menuDto;
    const slug = createSlug(name);

    if (await this.isSlugUsed(slug, id))
      throw new BadRequestException('The name has already been taken');

    const newDishes = dishes.map(async (dish) => {
      const dishFound = await this.dishService.findById(dish.id);
      if (!dishFound) throw new NotFoundException('Dish not found');
      dishFound.price = dish.price;
      return dishFound;
    });

    return this.menuModel
      .findByIdAndUpdate(
        id,
        {
          name,
          slug,
          image,
          dishes: newDishes,
        },
        { new: true },
      )
      .orFail(new NotFoundException('Menu not found'));
  }

  async destroy(id: string) {
    return this.menuModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Dish not found'));
  }

  async isSlugUsed(slug: string, id?: string) {
    const dish = await this.findBySlug(slug);
    return id ? dish && dish._id.toString() !== id : !!dish;
  }
}
