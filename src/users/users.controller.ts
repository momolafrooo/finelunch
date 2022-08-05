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
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Post()
  async save(@Body() userDto: UserDto) {
    return await this.userService.save(userDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: UserDto) {
    return await this.userService.update(id, userDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.userService.destroy(id);
  }
}
