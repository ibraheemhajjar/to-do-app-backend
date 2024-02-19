import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class TodoGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client "${socket.id}" Connected!`);
    });
  }

  @SubscribeMessage('newUpdates')
  onNewMessage() {
    console.log('new updates received');
    this.server.emit('refreshTodos');
  }
}
