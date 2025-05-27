import { IsBoolean, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { MessageStatus } from '../entities/message.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupMessageDto } from './create-message.dto';
export class UpdateMessageDto extends PartialType(CreateGroupMessageDto) {
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @IsOptional()
  @IsBoolean()
  is_withdrawn?: boolean;

  @IsOptional()
  @IsNumber()
  receiver?: number;

  @IsOptional()
  @IsNumber()
  quoted_message_id?: number;
}
