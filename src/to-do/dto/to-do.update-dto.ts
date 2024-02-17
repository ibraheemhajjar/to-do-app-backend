import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @ApiProperty() // for Swagger
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty() // for Swagger
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty() // for Swagger
  isDone?: boolean;
}
