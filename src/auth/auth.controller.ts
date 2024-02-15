import { UsersService } from './../users/users.service';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  signup(@Body() userDto: UserDto) {
    return this.authService.signup(userDto);
  }

  @Post('signin')
  signin(@Body() userDto: UserDto) {
    return this.authService.signin(userDto);
  }
}