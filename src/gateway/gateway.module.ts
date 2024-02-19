import { Module } from '@nestjs/common';
import { TodoGateway } from './gateway';

@Module({
  providers: [TodoGateway],
})
export class GatewayModule {}
