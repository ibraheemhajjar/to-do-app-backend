import { Todo } from 'src/to-do/todo.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user, { onDelete: 'CASCADE' })
  todos: Todo[];
}
