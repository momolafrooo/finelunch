import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenuDto } from './dto/menu.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginationQueryDto } from '../dto/index.dto';

@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(
    @Inject('MENU_SERVICE')
    private readonly menuService: MenusService,
  ) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.menuService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.menuService.findById(id);
  }

  @Post()
  async save(@Body() menuDto: MenuDto) {
    return await this.menuService.save(menuDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() menuDto: MenuDto) {
    return await this.menuService.update(id, menuDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.menuService.destroy(id);
  }
}
