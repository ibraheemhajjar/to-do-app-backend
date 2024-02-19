import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';

import { UserService } from './user/user.service';
import { UsersModule } from './user/user.module';
import { UsersController } from './user/user.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ToDoModule } from './to-do/to-do.module';
import { JwtService } from '@nestjs/jwt';
import { Todo } from './to-do/todo.entity';
import { TodoController } from './to-do/to-do.controller';
import { TodoService } from './to-do/to-do.service';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        entities: [User, Todo],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Todo]),
    AuthModule,
    UsersModule,
    ToDoModule,
    GatewayModule,
  ],
  controllers: [AppController, UsersController, AuthController, TodoController],
  providers: [AppService, UserService, AuthService, JwtService, TodoService],
})
export class AppModule {}
