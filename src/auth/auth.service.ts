import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSigninDto } from 'src/user/dto/user.signin-dto';
import { UserSignupDto } from 'src/user/dto/user.signup-dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(userSignupDto: UserSignupDto): Promise<any> {
    const { email, password, confirmPassword } = userSignupDto;
    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
    try {
      const existUser = await this.userService.findByEmail(email);
      if (existUser) {
        throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const createdUser = await this.userService.createUser({
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

  async validateUser(userSigninDto: UserSigninDto) {
    const user = await this.userService.findByEmail(userSigninDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const validPassport = await bcrypt.compare(
      userSigninDto.password,
      user.password,
    );
    if (!validPassport) {
      throw new UnauthorizedException('Unauthorized, Invalid password');
    }
    delete user.password;
    return user;
  }

  async signin(userSigninDto: UserSigninDto): Promise<any> {
    const user = await this.validateUser(userSigninDto);
    try {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '3d',
      });
      return { accessToken };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
