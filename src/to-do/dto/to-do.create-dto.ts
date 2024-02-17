import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean; // Default value will be 'false' if not provided

  @IsNotEmpty()
  userId: number;
}
