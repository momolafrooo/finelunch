import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionDto } from './dto/contribution.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('contributions')
export class ContributionsController {
  constructor(
    @Inject('CONTRIBUTION_SERVICE')
    private readonly contributionService: ContributionsService,
  ) {}

  @Get()
  async findAll() {
    return await this.contributionService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.contributionService.findByIdOrFail(id);
  }

  @Post()
  async save(@Body() contributionDto: ContributionDto) {
    return await this.contributionService.save(contributionDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.contributionService.destroy(id);
  }
}
