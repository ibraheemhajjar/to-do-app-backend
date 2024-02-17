import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSigninDto } from 'src/user/dto/user.signin-dto';
import { UserSignupDto } from 'src/user/dto/user.signup-dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(userSignupDto: UserSignupDto): Promise<any> {
    const { email, password, confirmPassword } = userSignupDto;
    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
    try {
      const existUser = await this.usersService.findByEmail(email);
      if (existUser) {
        throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const createdUser = await this.usersService.createUser({
        email,
        password: hashedPassword,
        confirmPassword,
      });
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async signin(userSigninDto: UserSigninDto): Promise<any> {
    const { email, password } = userSigninDto;
    try {
      const existUser = await this.usersService.findByEmail(email);
      if (!existUser) {
        throw new HttpException(
          'User email is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const isValidPassword = await bcrypt.compare(
        password,
        existUser.password,
      );
      if (!isValidPassword) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      const payload = { sub: existUser.id, email: existUser.email };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        }),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
