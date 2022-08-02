import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { DatabaseModule } from '../database/database.module';
import { dishesProviders } from './dishes.provider';

@Module({
  imports: [DatabaseModule],
  providers: [DishesService, ...dishesProviders],
  controllers: [DishesController],
})
export class DishesModule {}
