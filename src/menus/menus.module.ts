import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { DatabaseModule } from '../database/database.module';
import { menusProviders } from './menus.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [MenusController],
  providers: [MenusService, ...menusProviders],
})
export class MenusModule {}
