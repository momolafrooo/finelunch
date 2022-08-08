import { IsNotEmpty, IsNumber } from 'class-validator';

export class DishDto {
  @IsNotEmpty()
  name: string;

  image: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
