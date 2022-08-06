import { IsNotEmpty } from 'class-validator';

export class RestoDto {
  @IsNotEmpty()
  name: string;

  image: string;

  @IsNotEmpty()
  phone: string;
}
