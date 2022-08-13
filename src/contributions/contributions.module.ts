import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Contribution,
  ContributionSchema,
} from '../schemas/contribution.schema';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contribution.name, schema: ContributionSchema },
    ]),
    OrdersModule,
    UsersModule,
  ],
  controllers: [ContributionsController],
  providers: [
    {
      provide: 'CONTRIBUTION_SERVICE',
      useClass: ContributionsService,
    },
  ],
})
export class ContributionsModule {}
