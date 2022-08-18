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
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginationQueryDto } from '../dto/index.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderService: OrdersService,
  ) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.orderService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.orderService.findByIdOrFail(id);
  }

  @Post()
  async save(@Body() orderDto: OrderDto, @Request() req) {
    return await this.orderService.save(req?.user?._id, orderDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() orderDto: OrderDto,
    @Request() req,
  ) {
    return await this.orderService.update(id, req?.user?._id, orderDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.orderService.destroy(id);
  }
}
