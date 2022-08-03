import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Contribution,
  ContributionDocument,
} from '../schemas/contribution.schema';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectModel(Contribution.name)
    private readonly contributionModel: Model<ContributionDocument>,
  ) {}
}
