import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(userDto: UserDto): Promise<any> {
    const { email, password, confirmPassword } = userDto;
    try {
      if (password !== confirmPassword) {
        throw new Error('passwords do not mach');
      }
      const existUser = await this.usersService.findByEmail(email);
      if (existUser) {
        throw new Error('user already exist');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const createdUser = await this.usersService.createUser({
        email,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signin(userDto: UserDto): Promise<any> {
    const { email, password } = userDto;
    try {
      const existUser = await this.usersService.findByEmail(email);
      if (!existUser) {
        throw new Error('user does not exist');
      }
      const isValidPassword = await bcrypt.compare(
        password,
        existUser.password,
      );
      if (!isValidPassword) {
        throw new Error('invalid password');
      }
      const payload = { sub: existUser.id, email: existUser.email };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // async validateUser(email: string, password: string): Promise<User | null> {
  //   const user = await this.userService.findByEmail(email);
  //   if (user) {
  //     const isValidPassword = await bcrypt.compare(password, user.password);
  //     if (isValidPassword) {
  //       return user;
  //     }
  //   }
  //   return null;
  // }
}
