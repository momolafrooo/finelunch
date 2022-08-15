import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  roleId: string;

  @IsOptional()
  roleSlug: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @Length(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password?: string;

  @IsOptional()
  @Length(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  passwordConfirmation?: string;
}
