import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class MenuDto {
  @IsNotEmpty()
  name: string;

  image: string;

  @ValidateNested()
  @IsNotEmpty()
  @IsArray()
  dishes: Dish[];
}

class Dish {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  price: number;
}
