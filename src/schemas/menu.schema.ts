import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Dish } from './dish.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';

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

  @Prop([Dish])
  dishes: Dish[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

MenuSchema.plugin(mongoosePaginate);
