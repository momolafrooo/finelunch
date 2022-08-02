import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IMenu } from './menus.interface';

@Injectable()
export class MenusService {
  constructor(@Inject('Menu') private readonly menuModel: Model<IMenu>) {}
}
