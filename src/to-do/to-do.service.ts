import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/to-do.create-dto';
import { UpdateTodoDto } from './dto/to-do.update-dto';
import { Todo } from './todo.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private userService: UserService,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const user = await this.userService.findById(createTodoDto.userId);
    delete user.password;
    delete createTodoDto.userId;
    const todo = this.todoRepository.create(createTodoDto);
    todo.user = user;
    return await this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id: id });
    if (!todo) {
      throw new NotFoundException('Todo is not found');
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id); // Ensure the To-Do item exists

    // Update the properties:
    for (const prop in updateTodoDto) {
      if (updateTodoDto.hasOwnProperty(prop)) {
        // Protect from prototype pollution
        todo[prop] = updateTodoDto[prop];
      }
    }

    return await this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<any> {
    const result = await this.todoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Failed to delete the todo');
    }
    return result;
  }
}
