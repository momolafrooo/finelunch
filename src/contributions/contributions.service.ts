import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Contribution,
  ContributionDocument,
} from '../schemas/contribution.schema';
import { ContributionDto } from './dto/contribution.dto';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { ContributionType } from './contributions.type';
import { OrdersStatus } from '../orders/orders.status';

const MONTHLY_CONTRIBUTION = 10000;

@Injectable()
export class ContributionsService {
  constructor(
    @InjectModel(Contribution.name)
    private readonly contributionModel: Model<ContributionDocument>,
    @Inject('USER_SERVICE')
    private readonly userService: UsersService,
    @Inject('ORDER_SERVICE')
    private readonly orderService: OrdersService,
  ) {}

  async findAll() {
    return this.contributionModel
      .find()
      .populate({
        path: 'order',
        populate: 'user',
      })
      .populate('user');
  }

  async findById(id: string) {
    return this.contributionModel.findById(id);
  }

  async findByMonth(month: string) {
    return this.contributionModel.findOne({ month });
  }

  async findByIdOrFail(id: string) {
    return this.contributionModel
      .findById(id)
      .populate({
        path: 'order',
        populate: 'user',
      })
      .populate('user')
      .orFail(new NotFoundException('Contribution not found'));
  }

  async findByUserIdAndOrderId(userId: string, orderId: string) {
    return this.contributionModel
      .findOne({ user: userId, order: orderId })
      .populate({
        path: 'order',
        populate: 'user',
      })
      .populate('user');
  }

  async save(contributionDto: ContributionDto) {
    const contribution = await this.validateContribution(contributionDto);

    return this.contributionModel.create(contribution);
  }

  async destroy(id: string) {
    const contribution = await this.findByIdOrFail(id);

    if (contribution.type === ContributionType.EXTRAS) {
      await this.orderService.resetOrderById(
        contribution?.order?._id,
        contribution.amount,
      );
    }

    return this.contributionModel.findByIdAndDelete(id);
  }

  private async validateContribution(contributionDto: ContributionDto) {
    if (contributionDto.type === ContributionType.EXTRAS) {
      return await this.validateExtraContribution(contributionDto);
    } else if (contributionDto.type === ContributionType.MONTHLY) {
      return await this.validateMonthlyContribution(contributionDto);
    } else {
      throw new BadRequestException('Invalid contribution type');
    }
  }

  private async validateExtraContribution(contributionDto: ContributionDto) {
    const contribution = await this.findByUserIdAndOrderId(
      contributionDto.userId,
      contributionDto.orderId,
    );

    if (contribution) {
      throw new BadRequestException('User already contributed');
    }

    const order = await this.orderService.findByIdOrFail(
      contributionDto.orderId,
    );

    if (order.status !== OrdersStatus.PENDING) {
      throw new BadRequestException(
        'Cant add extras to an order that is completed',
      );
    }

    if (contributionDto.amount !== order.rest) {
      throw new BadRequestException(`You have to pay ${order.rest} XOF`);
    }

    await this.orderService.validateOrder(order._id);

    return {
      order,
      amount: contributionDto.amount,
      type: contributionDto.type,
    };
  }

  private async validateMonthlyContribution(contributionDto: ContributionDto) {
    const user = await this.userService.findByIdOrFail(contributionDto.userId);

    const contribution = await this.findByMonth(contributionDto.month);

    if (contribution) {
      throw new BadRequestException('Month already contributed');
    }

    if (contributionDto.amount !== MONTHLY_CONTRIBUTION) {
      throw new BadRequestException(
        `The monthly contribution is ${MONTHLY_CONTRIBUTION} XOF`,
      );
    }

    return {
      user,
      amount: contributionDto.amount,
      type: contributionDto.type,
      month: contributionDto.month,
    };
  }
}
