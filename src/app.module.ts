import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { MenusModule } from './menus/menus.module';
import { DishesModule } from './dishes/dishes.module';
import { ContributionsModule } from './contributions/contributions.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
