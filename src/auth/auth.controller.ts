import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignupDto } from 'src/user/dto/user.signup-dto';
import { UserSigninDto } from 'src/user/dto/user.signin-dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -------------------------------------------User signup endpoint-----------------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'New user signup ' })
  @ApiBody({
    type: UserSignupDto,
    description: 'user sign up data (email, password, confirmPassword)',
  })
  @ApiResponse({
    status: 201,
    description: 'New user created',
    type: User,
  })
  // End of Swagger Decorators
  @Post('signup')
  signup(@Body() userSignupDto: UserSignupDto) {
    return this.authService.signup(userSignupDto);
  }

  // --------------------------------------------User signin endpoint-----------------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'User signin' })
  @ApiBody({
    type: UserSigninDto,
    description: 'user signin data (email, password)',
  })
  @ApiResponse({
    status: 200,
    description: 'user access token',
    type: 'string token',
  })
  // End of Swagger Decorators
  @HttpCode(200)
  @Post('signin')
  signin(@Body() userSigninDto: UserSigninDto) {
    return this.authService.signin(userSigninDto);
  }
}
