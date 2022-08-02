import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '../database/database.module';
import { ordersProviders } from './orders.provider';

@Module({
  imports: [DatabaseModule],
  providers: [OrdersService, ...ordersProviders],
  controllers: [OrdersController],
})
export class OrdersModule {}
