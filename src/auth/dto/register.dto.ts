import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  // Minimum eight characters, at least one uppercase letter,
  // one lowercase letter, one number and one special character
  @IsNotEmpty()
  @Length(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @IsNotEmpty()
  @Length(8)
  passwordConfirmation: string;
}
