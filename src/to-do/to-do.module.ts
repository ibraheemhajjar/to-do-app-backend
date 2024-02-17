import { Module } from '@nestjs/common';
import { TodoController } from './to-do.controller';
import { TodoService } from './to-do.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  controllers: [TodoController],
  providers: [TodoService, UserService],
})
export class ToDoModule {}
