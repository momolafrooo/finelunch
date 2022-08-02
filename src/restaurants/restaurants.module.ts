import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { DatabaseModule } from '../database/database.module';
import { restaurantsProviders } from './restaurant.provider';

@Module({
  imports: [DatabaseModule],
  providers: [RestaurantsService, ...restaurantsProviders],
  controllers: [RestaurantsController],
})
export class RestaurantsModule {}
