import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionDto } from './dto/contribution.dto';

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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() contributionDto: ContributionDto,
  ) {
    return await this.contributionService.update(id, contributionDto);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {
    return await this.contributionService.destroy(id);
  }
}
