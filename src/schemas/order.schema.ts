import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Dish } from './dish.schema';

export type OrderDocument = Order & mongoose.Document;

@Schema()
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true,
  })
  dish: Dish;

  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: true,
  })
  rest: number;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.user = ret.user.firstName + ' ' + ret.user.lastName;
    ret.dish = ret.dish.name;
    return ret;
  },
});
