import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://momolafrooo:Momo1996Fall@cluster0.30odm.mongodb.net/finelunch?retryWrites=true&w=majority',
      ),
  },
];
