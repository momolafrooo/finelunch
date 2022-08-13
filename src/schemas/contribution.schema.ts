import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { OrderDocument } from './order.schema';

export type ContributionDocument = Contribution & mongoose.Document;

@Schema()
export class Contribution {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false,
  })
  order: OrderDocument;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: false,
  })
  month: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
