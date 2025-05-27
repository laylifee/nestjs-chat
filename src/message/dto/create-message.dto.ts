import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateIf,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { MessageType } from '../entities/message.entity';
import { Optional } from '@nestjs/common';

export class CreateGroupMessageDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number; // 发送者用户ID

  @IsNotEmpty()
  @IsNumber()
  groupId: number; // 群组ID（替代原来的receiver）

  @IsNotEmpty()
  @IsEnum(MessageType)
  messageType: MessageType; // 消息类型

  // 文本消息内容
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content?: string;

  // 文件/图片消息URL
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fileUrl?: string;

  // @IsOptional()
  // @IsArray()
  // @ArrayMinSize(1)
  // @IsNumber({}, { each: true })
  // mentionedUserIds?: number[]; // @提及的用户ID数组

  @IsOptional()
  @IsNumber()
  replyToMessageId?: number; // 回复的消息ID

  // @IsOptional()
  // @IsString()
  // customProperties?: string; // 自定义扩展属性（JSON字符串）
}
