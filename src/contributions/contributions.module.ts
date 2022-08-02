import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { DatabaseModule } from '../database/database.module';
import { contributionsProviders } from './constributions.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ContributionsController],
  providers: [ContributionsService, ...contributionsProviders],
})
export class ContributionsModule {}
