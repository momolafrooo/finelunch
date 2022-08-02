import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IContribution } from './constributions.interface';

@Injectable()
export class ContributionsService {
  constructor(
    @Inject('Contribution') private readonly contribution: Model<IContribution>,
  ) {}
}
