import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TodoService } from './to-do.service';
import { CreateTodoDto } from './dto/to-do.create-dto';
import { UpdateTodoDto } from './dto/to-do.update-dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create-todo')
  createTodo(@Body() createTodoDto: CreateTodoDto, @Req() request: Request) {
    const userId = request['user'].sub;
    return this.todoService.create(createTodoDto, userId);
  }

  @Get()
  findAll(@Req() request: Request) {
    const userId = request['user'].sub;
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  async findTodoById(@Param('id') id: string, @Req() request: Request) {
    const userId = request['user'].sub;
    const todo = await this.todoService.findOne(+id, userId);

    if (!todo) {
      throw new NotFoundException('Todo is not found');
    }
    return todo;
  }

  @Put(':id')
  update(
    @Param('id') id: any,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.todoService.update(+id, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const userId = request['user'].sub;
    return this.todoService.remove(+id, userId);
  }
}
