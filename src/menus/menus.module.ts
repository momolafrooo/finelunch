import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from '../schemas/menu.schema';
import { DishesModule } from '../dishes/dishes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
    DishesModule,
  ],
  controllers: [MenusController],
  providers: [
    {
      provide: 'MENU_SERVICE',
      useClass: MenusService,
    },
  ],
})
export class MenusModule {}
