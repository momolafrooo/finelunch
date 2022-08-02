import { Connection } from 'mongoose';
import { ContributionSchema } from '../schemas/contribution.schema';

export const contributionsProviders = [
  {
    provide: 'Contribution',
    useFactory: (connection: Connection) =>
      connection.model('Contribution', ContributionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
