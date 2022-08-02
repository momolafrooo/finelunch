import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IRestaurant } from './restaurants.interface';

@Injectable()
export class RestaurantsService {
  constructor(
    @Inject('Restaurant') private readonly restaurantModel: Model<IRestaurant>,
  ) {}
}
