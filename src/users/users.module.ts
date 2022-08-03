import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  providers: [
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    ...usersProviders,
  ],
  controllers: [UsersController],
  exports: [
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
  ],
  imports: [DatabaseModule],
})
export class UsersModule {}
