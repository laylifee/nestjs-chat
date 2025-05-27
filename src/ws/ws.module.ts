import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { MessageModule } from '../message/message.module';
import { GroupModule } from '../group/group.module';
@Module({
  imports: [AuthModule, MessageModule, GroupModule],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
