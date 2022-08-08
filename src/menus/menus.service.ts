import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { MenuDto, SelectedDish } from './dto/menu.dto';
import { DishesService } from '../dishes/dishes.service';
import { createSlug } from '../utils/slug';

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
    const { image, dishes } = menuDto;
    const name = this.generateMenuName();

    if (await this.isSlugUsed(createSlug(name)))
      throw new BadRequestException('There is already a menu for today');

    const newDishes = await this.getUpdatedDishes(dishes);

    return this.menuModel.create({
      name,
      slug: createSlug(name),
      image,
      dishes: newDishes,
    });
  }

  async update(id: string, menuDto: MenuDto) {
    const { image, dishes } = menuDto;

    const newDishes = await this.getUpdatedDishes(dishes);

    return this.menuModel
      .findByIdAndUpdate(
        id,
        {
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
      .orFail(new NotFoundException('Menu not found'));
  }

  async isSlugUsed(slug: string, id?: string) {
    const dish = await this.findBySlug(slug);
    return id ? dish && dish._id.toString() !== id : !!dish;
  }

  generateMenuName() {
    return (
      'Menu du ' +
      new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'full',
      }).format(Date.now())
    );
  }

  private async getUpdatedDishes(dishes: SelectedDish[]) {
    const promisedDishes = dishes.map((dish) =>
      this.dishService.findByIdOrFail(dish.id),
    );

    return (await Promise.all(promisedDishes)).map((dish) => {
      const selectedDish = dishes.find(
        (dishItem) => dishItem.id === dish._id.toString(),
      );

      if (selectedDish.price) dish.price = selectedDish.price;
      return dish;
    });
  }
}
