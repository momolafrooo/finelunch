import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type ContributionDocument = Contribution & mongoose.Document;

@Schema()
export class Contribution {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    required: true,
    unique: true,
  })
  type: string;

  @Prop({
    required: true,
    unique: true,
  })
  amount: number;

  @Prop({
    required: true,
    unique: true,
  })
  month: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
