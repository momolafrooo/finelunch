import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schemas/order.schema';
import { MenusModule } from '../menus/menus.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MenusModule,
  ],
  providers: [
    {
      provide: 'ORDER_SERVICE',
      useClass: OrdersService,
    },
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
