import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class MenuDto {
  image: string;

  @ValidateNested()
  @IsNotEmpty()
  @IsArray()
  dishes: SelectedDish[];
}

export class SelectedDish {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  price: number;
}
