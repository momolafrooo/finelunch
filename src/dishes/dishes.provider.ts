import { Connection } from 'mongoose';
import { DishSchema } from '../schemas/dish.schema';

export const dishesProviders = [
  {
    provide: 'Dish',
    useFactory: (connection: Connection) =>
      connection.model('Dish', DishSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
