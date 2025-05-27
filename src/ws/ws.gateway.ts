import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { MessageService } from 'src/message/message.service';
import { GroupService } from 'src/group/group.service';
import {
  MessageStatusEvent,
  MessageEvent,
} from './interfaces/message.interface';
import { MessageType } from '../message/entities/message.entity';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private messageService: MessageService,
    private groupService: GroupService,
  ) {}
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) {
        client.disconnect();
        return;
      }
      //   const payload = this.jwtService.verify(token);
      const payload = await this.authService.validateUserByToken(token);
      console.log('Payload:', payload);
      client.data.user = payload;
      console.log('client.data.user', client.data.user);

      // 加入用户私人房间
      client.join(`user_${payload.id}`);
    } catch (error) {
      //   console.error('Connection error:', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('message_group')
  async handleMessageStatus(
    client: Socket,
    payload: { groupId: number; text: string },
  ) {
    console.log('Received message:', payload);

    const message = await this.messageService.create({
      content: payload.text,
      groupId: payload.groupId,
      senderId: client.data.user.id,
      messageType: MessageType.TEXT,
    });

    console.log('Stored message:', message);
    this.server.to(`group_${payload.groupId}`).emit('newMessage', message);
  }
  // 处理加入群组请求
  @SubscribeMessage('joinGroup')
  handleJoinGroup(client: Socket, payload: { groupId: number }) {
    client.join(`group_${payload.groupId}`); // 加入动态房间
    // console.log(`用户 ${client.data.user.id} 加入群组 ${payload.groupId}`);
  }
  //   离开群组
  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(client: Socket, payload: { groupId: number }) {
    client.leave(`group_${payload.groupId}`);
    console.log(`用户 ${client.data.userId} 离开群组 ${payload.groupId}`);
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      client.leave(`user_${client.data.user.id}`);
    }
  }

  @SubscribeMessage('send_message')
  handleSendMessage(client: Socket, payload: MessageEvent) {
    console.log('Received message:', payload);
    this.server.to(`user_${payload.id}`).emit('send_message', payload);
  }

  @SubscribeMessage('group_message')
  async handleGroupMessage(client: Socket, payload: MessageEvent) {
    console.log('Received message:', payload);
    this.server.to(`user_${payload.id}`).emit('group_message', payload);
  }

  broadcastMessage(event: string, message: MessageEvent) {
    this.server.emit(event, message);
  }

  broadcastWithdraw(messageId: number, userId: number) {
    this.server.to(`user_${userId}`).emit('message_withdrawn', { messageId });
  }
}
