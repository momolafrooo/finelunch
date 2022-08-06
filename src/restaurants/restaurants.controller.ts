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
import { RestaurantsService } from './restaurants.service';
import { RestoDto } from './dto/restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    @Inject('RESTAURANT_SERVICE')
    private readonly restaurantService: RestaurantsService,
  ) {}

  @Get()
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.restaurantService.findById(id);
  }

  @Post()
  async save(@Body() restoDto: RestoDto) {
    return await this.restaurantService.save(restoDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() restoDto: RestoDto) {
    return await this.restaurantService.update(id, restoDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.restaurantService.destroy(id);
  }
}
