import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IOrder } from './orders.interface';

@Injectable()
export class OrdersService {
  constructor(@Inject('Order') private readonly orderModel: Model<IOrder>) {}
}
