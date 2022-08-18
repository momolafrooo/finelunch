import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderDto } from './dto/order.dto';
import { MenusService } from '../menus/menus.service';
import { DishDocument } from '../schemas/dish.schema';
import { OrdersStatus } from './orders.status';
import * as moment from 'moment';
import { PaginationQueryDto } from '../dto/index.dto';

const GRANT = 1500;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: PaginateModel<OrderDocument>,
    @Inject('MENU_SERVICE')
    private readonly menuService: MenusService,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 12, sort = 'asc' } = query;

    return this.orderModel.paginate(
      {},
      {
        sort: { created_at: sort === 'asc' ? 1 : -1 },
        populate: ['dish', 'user'],
        limit,
        page,
      },
    );
  }

  async findById(id: string) {
    return this.orderModel.findById(id);
  }

  async findByIdOrFail(id: string) {
    return this.orderModel
      .findById(id)
      .populate('dish')
      .populate('user')
      .orFail(new BadRequestException('Order not found'));
  }

  async save(userId: string, orderDto: OrderDto) {
    const menu = await this.menuService.findByIdOrFail(orderDto.menuId);

    if (this.menuService.isExpired(menu.created_at)) {
      throw new BadRequestException('Menu expired');
    }

    const order = await this.findByUserIdAndDate(userId, menu.created_at);

    if (order)
      throw new BadRequestException('You already have an order for this menu');

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

  async resetOrderById(orderId: string, amount: number) {
    const order = await this.findByIdOrFail(orderId);

    return this.orderModel.findByIdAndUpdate(
      order._id,
      {
        rest: amount,
        status: OrdersStatus.PENDING,
      },
      { new: true },
    );
  }

  async validateOrder(orderId: string) {
    return this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          rest: 0,
          status: OrdersStatus.COMPLETED,
        },
        { new: true },
      )
      .orFail(new BadRequestException('Order not found'));
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    return this.orderModel.findOne({
      user: userId,
      created_at: {
        $gte: start,
        $lte: end,
      },
    });
  }

  async destroy(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
