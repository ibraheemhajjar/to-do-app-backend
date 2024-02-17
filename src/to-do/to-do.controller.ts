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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Todo } from './todo.entity';
@ApiTags('todos')
@ApiBearerAuth() //all these routes require bearer token (access token) for authentication
@UseGuards(JwtGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // -----------------------------------------Create To-do endpoint---------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'Create new to-do' })
  @ApiBody({
    type: CreateTodoDto,
    description: 'create new to-do data',
  })
  @ApiResponse({
    status: 201,
    description: 'New to-do created',
    type: Todo,
  })
  // End of Swagger Decorators
  @Post('create-todo')
  createTodo(@Body() createTodoDto: CreateTodoDto, @Req() request: Request) {
    const userId = request['user'].sub;
    return this.todoService.create(createTodoDto, userId);
  }

  // ---------------------------------------Get all To-do's endpoint----------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'Get all to-dos' })
  @ApiResponse({
    status: 200,
    description: 'Array of all to-dos',
    type: Array<Todo>,
  })
  // End of Swagger Decorators
  @Get()
  findAll(@Req() request: Request) {
    const userId = request['user'].sub;
    return this.todoService.findAll(userId);
  }

  // -------------------------------------Get To-do by ID endpoint-------------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'Get to-do by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Todo ID' })
  @ApiResponse({
    status: 200,
    description: 'to-do matching the id',
    type: Todo,
  })
  // End of Swagger Decorators
  @Get(':id')
  async findTodoById(@Param('id') id: string, @Req() request: Request) {
    const userId = request['user'].sub;
    const todo = await this.todoService.findOne(+id, userId);
    if (!todo) {
      throw new NotFoundException('Todo is not found');
    }
    return todo;
  }

  // ------------------------------------Update To-do endpoint-----------------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'Update to-do by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Todo ID' })
  @ApiBody({
    type: UpdateTodoDto,
    description: 'Update to-do data',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated to-do',
    type: Todo,
  })
  // End of Swagger Decorators
  @Put(':id')
  update(
    @Param('id') id: any,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return this.todoService.update(+id, updateTodoDto, userId);
  }

  // -----------------------------------Delete To-do endpoint-------------------------------------------------
  // Start of Swagger Decorators
  @ApiOperation({ summary: 'Delete to-do by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Todo ID' })
  @ApiResponse({
    status: 200,
    description: 'To-do deleted',
    type: 'affected : 1',
  })
  // End of Swagger Decorators
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const userId = request['user'].sub;
    return this.todoService.remove(+id, userId);
  }
}
