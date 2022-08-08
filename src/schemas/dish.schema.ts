import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from './restaurant.schema';

export type DishDocument = Dish & mongoose.Document;

@Schema()
export class Dish {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    required: true,
  })
  price: number;

  @Prop()
  image: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false,
  })
  restaurant?: Restaurant;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
