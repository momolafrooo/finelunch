import { IRestaurant } from '../restaurants/restaurants.interface';

export interface IMenu {
  name: string;
  image: string;
  restaurant: IRestaurant;
}
