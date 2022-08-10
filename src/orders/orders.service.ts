import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderDto } from './dto/order.dto';
import { MenusService } from '../menus/menus.service';
import { DishDocument } from '../schemas/dish.schema';
import { OrdersStatus } from './orders.status';

const GRANT = 1500;

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
    const order = await this.findByUserIdAndDate(userId, orderDto.menuId);

    console.log(order);

    if (order)
      throw new BadRequestException('You already have an order for this menu');

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
      amount: dish.price,
      rest: dish.price - GRANT,
      status:
        dish.price > GRANT ? OrdersStatus.PENDING : OrdersStatus.COMPLETED,
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
        amount: dish.price,
        rest: dish.price - GRANT,
        status:
          dish.price > GRANT ? OrdersStatus.PENDING : OrdersStatus.COMPLETED,
      },
      { new: true },
    );
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    return this.orderModel.findOn({ user: userId, created_at: menuId });
  }

  async destroy(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
