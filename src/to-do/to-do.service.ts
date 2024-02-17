import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const user = await this.userService.findById(userId);
    const todo = this.todoRepository.create(createTodoDto);
    todo.user = user;
    return await this.todoRepository.save(todo);
  }

  async findAll(userId: number): Promise<Todo[]> {
    return await this.todoRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });
    if (!todo) {
      throw new NotFoundException('Todo is not found');
    }
    return todo;
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    if (userId !== todo.user.id) {
      throw new UnauthorizedException('not authorized to update this to-do');
    }
    // Update the properties:
    for (const prop in updateTodoDto) {
      if (updateTodoDto.hasOwnProperty(prop)) {
        // Protect from prototype pollution
        todo[prop] = updateTodoDto[prop];
      }
    }
    return await this.todoRepository.save(todo);
  }

  async remove(id: number, userId: number): Promise<any> {
    const result = await this.todoRepository.delete({
      id,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Failed to delete the todo');
    }
    return result;
  }
}
