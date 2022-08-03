import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
  @Prop({
    required: true,
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
  phone: string;

  @Prop()
  image: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
