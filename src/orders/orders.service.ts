import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderDto } from './dto/order.dto';
import { MenusService } from '../menus/menus.service';
import { DishDocument } from '../schemas/dish.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @Inject('MENU_SERVICE')
    private readonly menuService: MenusService,
  ) {}

  async findAll() {
    return this.orderModel.find().populate('dish').populate('user');
  }

  async findById(id: string) {
    return this.orderModel.findById(id);
  }

  async findByIdOrFail(id: string) {
    return this.orderModel
      .findById(id)
      .orFail(new BadRequestException('Order not found'));
  }

  async save(userId: string, orderDto: OrderDto) {
    const order = await this.findByUserIdAndMenuId(userId, orderDto.menuId);

    if (order)
      throw new BadRequestException('You already have an order for today');

    const menu = await this.menuService.findByIdOrFail(orderDto.menuId);

    if (this.menuService.isExpired(menu.created_at)) {
      throw new BadRequestException('Menu expired');
    }

    const dish = menu.dishes.find(
      (dish: DishDocument) => dish._id.toString() === orderDto.dishId,
    );

    if (!dish)
      throw new BadRequestException(
        'The dish doesnt belong to the selected menu',
      );

    return this.orderModel.create({
      user: userId,
      dish,
    });
  }

  async update(orderId: string, userId: string, orderDto: OrderDto) {
    const order = await this.findByIdOrFail(orderId);

    const menu = await this.menuService.findByIdOrFail(orderDto.menuId);

    if (this.menuService.isExpired(menu.created_at)) {
      throw new BadRequestException('Menu expired');
    }

    const dish = menu.dishes.find(
      (dish: DishDocument) => dish._id.toString() === orderDto.dishId,
    );

    if (!dish)
      throw new BadRequestException(
        'The dish doesnt belong to the selected menu',
      );

    return this.orderModel.findByIdAndUpdate(
      order._id,
      {
        user: userId,
        dish,
      },
      { new: true },
    );
  }

  async findByUserIdAndMenuId(userId: string, menuId: string) {
    return this.orderModel.findOne({ user: userId, menu: menuId });
  }

  async destroy(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
