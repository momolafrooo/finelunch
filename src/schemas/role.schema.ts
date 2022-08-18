import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
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
    default: Date.now(),
  })
  created_at: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.plugin(mongoosePaginate);
