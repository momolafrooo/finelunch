import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from './restaurant.schema';
import { Dish } from './dish.schema';

export type MenuDocument = Menu & mongoose.Document;

@Schema()
export class Menu {
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

  @Prop()
  image: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  })
  restaurant: Restaurant;

  @Prop([Dish])
  dishes: Dish[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
