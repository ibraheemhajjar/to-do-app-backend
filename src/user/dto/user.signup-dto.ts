import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password should not be empty' })
  @MinLength(8, {
    message: 'Confirm password must be at least 8 characters long',
  })
  confirmPassword: string;
}
