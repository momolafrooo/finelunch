import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { MenusModule } from './menus/menus.module';
import { DishesModule } from './dishes/dishes.module';
import { ContributionsModule } from './contributions/contributions.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    RolesModule,
    RestaurantsModule,
    OrdersModule,
    MenusModule,
    DishesModule,
    ContributionsModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
