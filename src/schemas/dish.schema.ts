import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type DishDocument = Dish & mongoose.Document;

@Schema()
export class Dish {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    required: true,
    unique: true,
  })
  price: number;

  @Prop()
  image: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
