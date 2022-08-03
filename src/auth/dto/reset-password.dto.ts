import { IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @Length(10)
  token: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsNotEmpty()
  @Length(6)
  passwordConfirmation: string;
}
