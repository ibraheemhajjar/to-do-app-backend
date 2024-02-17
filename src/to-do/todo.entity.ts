import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  @ApiProperty() // for Swagger
  id: number;

  @Column()
  @ApiProperty() // for Swagger
  title: string;

  @Column()
  @ApiProperty() // for Swagger
  description: string;

  @Column({ default: false })
  @ApiProperty() // for Swagger
  isDone: boolean;

  @ManyToOne(() => User, (user) => user.todos, { lazy: true })
  user: User;
}
