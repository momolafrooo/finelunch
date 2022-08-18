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
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginationQueryDto } from '../dto/index.dto';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(
    @Inject('ROLE_SERVICE') private readonly roleService: RolesService,
  ) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.roleService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.roleService.findById(id);
  }

  @Post()
  async save(@Body() roleDto: RoleDto) {
    return await this.roleService.save(roleDto.name);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() roleDto: RoleDto) {
    return await this.roleService.update(id, roleDto.name);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.roleService.destroy(id);
  }
}
