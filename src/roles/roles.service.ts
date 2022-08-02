import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { IRole } from './IRole.interface';

@Injectable()
export class RolesService {
  constructor(@Inject('Role') private readonly roleModel: Model<IRole>) {}
}
