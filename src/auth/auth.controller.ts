import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from 'src/user/dto/user.signup-dto';
import { UserSigninDto } from 'src/user/dto/user.signin-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() userSignupDto: UserSignupDto) {
    return this.authService.signup(userSignupDto);
  }

  @Post('signin')
  signin(@Body() userSigninDto: UserSigninDto) {
    return this.authService.signin(userSigninDto);
  }
}
