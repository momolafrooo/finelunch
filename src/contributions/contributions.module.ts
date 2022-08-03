import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Contribution,
  ContributionSchema,
} from '../schemas/contribution.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contribution.name, schema: ContributionSchema },
    ]),
  ],
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionsModule {}
