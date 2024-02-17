import { ApiProperty } from '@nestjs/swagger';
import { Todo } from 'src/to-do/todo.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty() // for Swagger
  id: number;

  @Column()
  @ApiProperty() // for Swagger
  email: string;

  @Column()
  @ApiProperty() // for Swagger
  password: string;

  @ApiProperty() // for Swagger
  @OneToMany(() => Todo, (todo) => todo.user, { onDelete: 'CASCADE' })
  todos: Todo[];
}
