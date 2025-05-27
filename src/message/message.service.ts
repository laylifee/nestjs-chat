import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  Message,
  MessageStatus,
  ReceiverType,
} from './entities/message.entity';
// import { WsGateway } from '../ws/ws.gateway';
import { User } from '../user/entities/user.entity';
@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // @Inject(WsGateway)
    // private wsGateway: WsGateway,
  ) {}

  async create(messageDto: CreateGroupMessageDto) {
    console.log('Creating message:', messageDto);
    // 检查发送者是否存在
    const sender = await this.userRepository.findOne({
      where: { id: messageDto.senderId },
    });
    if (!sender) {
      throw new Error('Sender not found');
    }

    return this.messageRepository.save(messageDto);
  }

  async findByGroup(groupId: number) {
    return this.messageRepository.find({
      where: { group: { id: groupId } },
      relations: ['sender'],
    });
  }
  // ...保持其他方法不变，添加相应的事件广播
  async withdrawMessage(id: number): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new Error('Message not found');
    }

    message.status = MessageStatus.WITHDRAWN;
    await this.messageRepository.save(message);

    // 广播撤回消息事件
    // this.wsGateway.broadcastMessage('message_withdrawn', {
    //   id: message.id,
    //   withdrawnAt: new Date(),
    // });

    return message;
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['sender', 'receiver'],
    });
  }
  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  }
  async findBySender(senderId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { sender: { id: senderId } },
      relations: ['sender', 'receiver'],
    });
  }
  async findByReceiver(
    receiverId: number,
    type: ReceiverType = ReceiverType.USER,
  ): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiver_type: type },
      relations: ['sender', 'receiver'],
    });
  }
  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new Error('Message not found');
    }

    Object.assign(message, updateMessageDto);
    return this.messageRepository.save(message);
  }
  async remove(id: number): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Message not found');
    }
  }
}
