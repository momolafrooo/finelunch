import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('User') private readonly userModel: Model<IUser>) {}
}
