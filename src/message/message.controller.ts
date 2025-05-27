import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateGroupMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ReceiverType } from './entities/message.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMessageDto: CreateGroupMessageDto) {
    try {
      return await this.messageService.create(createMessageDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/withdraw')
  @HttpCode(HttpStatus.OK)
  async withdraw(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.messageService.withdrawMessage(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.findOne(id);
  }

  @Get('sender/:senderId')
  findBySender(@Param('senderId', ParseIntPipe) senderId: number) {
    return this.messageService.findBySender(senderId);
  }

  @Get('receiver/:receiverId')
  findByReceiver(
    @Param('receiverId', ParseIntPipe) receiverId: number,
    @Query('type') type: ReceiverType = ReceiverType.USER,
  ) {
    return this.messageService.findByReceiver(receiverId, type);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    try {
      return this.messageService.update(id, updateMessageDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove(id);
  }
}
