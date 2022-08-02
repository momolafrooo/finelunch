import { Connection } from 'mongoose';
import { RestaurantSchema } from '../schemas/restaurant.schema';

export const restaurantsProviders = [
  {
    provide: 'Restaurant',
    useFactory: (connection: Connection) =>
      connection.model('Restaurant', RestaurantSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
