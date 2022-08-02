import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IDish } from './dishes.interface';

@Injectable()
export class DishesService {
  constructor(@Inject('Dish') private readonly dishModel: Model<IDish>) {}
}
