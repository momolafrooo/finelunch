import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';
import { Exclude } from 'class-transformer';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop()
  avatar: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  })
  role: Role;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  username: 'text',
  email: 'text',
  firstName: 'text',
  lastName: 'text',
});

UserSchema.plugin(mongoosePaginate);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});
