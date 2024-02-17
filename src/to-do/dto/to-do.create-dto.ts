import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty() // for Swagger
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty() // for Swagger
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty() // for Swagger
  isDone?: boolean; // Default value will be 'false' if not provided
}
