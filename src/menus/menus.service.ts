import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { MenuDto, SelectedDish } from './dto/menu.dto';
import { DishesService } from '../dishes/dishes.service';
import { createSlug } from '../utils/slug';
import { PaginationQueryDto } from '../dto/index.dto';
import { getSearchQuery } from '../utils/search';

const SEARCH_FIELDS = ['name'];

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private readonly menuModel: PaginateModel<MenuDocument>,
    @Inject('DISH_SERVICE')
    private readonly dishService: DishesService,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 12, sort = 'asc', search } = query;

    const options = getSearchQuery(SEARCH_FIELDS, search);
    return await this.menuModel.paginate(
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
    return this.menuModel.findById(id);
  }

  async findByIdOrFail(id: string) {
    return this.menuModel
      .findById(id)
      .orFail(new NotFoundException('Menu not found'));
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

  isExpired(createdAt: Date) {
    const dateNow = new Intl.DateTimeFormat().format(Date.now());
    const formattedCreatedAt = new Intl.DateTimeFormat().format(createdAt);
    return dateNow > formattedCreatedAt;
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
