import { Connection } from 'mongoose';
import { OrderSchema } from '../schemas/order.schema';

export const ordersProviders = [
  {
    provide: 'Order',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
