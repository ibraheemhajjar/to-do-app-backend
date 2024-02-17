import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserSignupDto } from './dto/user.signup-dto';
import { User } from './user.entity';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(userSignupDto: UserSignupDto): Promise<User> {
    delete userSignupDto.confirmPassword;
    const user = this.usersRepository.create(userSignupDto);
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email'],
    });
  }
  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email'],
    });
  }
}
