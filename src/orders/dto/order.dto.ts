import { IsNotEmpty } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  menuId: string;

  @IsNotEmpty()
  dishId: string;
}
