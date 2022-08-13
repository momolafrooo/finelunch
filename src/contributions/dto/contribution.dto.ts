import { IsNotEmpty } from 'class-validator';

export class ContributionDto {
  userId?: string;
  orderId?: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  amount: number;

  month?: string;
}
