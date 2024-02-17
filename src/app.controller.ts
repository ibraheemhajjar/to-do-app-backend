import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Welcome at root path')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({ summary: 'Welcome to the application' })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    type: 'welcome message',
  })
  @Get()
  getHello(): string {
    return this.appService.getWelcome();
  }
}
