import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishDto } from './dto/dish.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('dishes')
export class DishesController {
  constructor(
    @Inject('DISH_SERVICE')
    private readonly dishService: DishesService,
  ) {}

  @Get()
  async findAll() {
    return await this.dishService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.dishService.findById(id);
  }

  @Post()
  async save(@Body() dishDto: DishDto) {
    return await this.dishService.save(dishDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dishDto: DishDto) {
    return await this.dishService.update(id, dishDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.dishService.destroy(id);
  }
}
