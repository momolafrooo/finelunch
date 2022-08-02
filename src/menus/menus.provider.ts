import { Connection } from 'mongoose';
import { MenuSchema } from '../schemas/menu.schema';

export const menusProviders = [
  {
    provide: 'Menu',
    useFactory: (connection: Connection) =>
      connection.model('Menu', MenuSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
