import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { TodoService } from './to-do.service';
import { CreateTodoDto } from './dto/to-do.create-dto';
import { UpdateTodoDto } from './dto/to-do.update-dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create-todo')
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findTodoById(@Param('id') id: string) {
    const todo = await this.todoService.findOne(+id);

    if (!todo) {
      throw new NotFoundException('Todo is not found');
    }
    return todo;
  }

  @Put(':id')
  update(@Param('id') id: any, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
