import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserSigninDto } from './user.dto';
import { User } from './user.entity';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(userSigninDto: UserSigninDto): Promise<User> {
    return this.usersRepository.save(userSigninDto);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
