import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entity/group.entity';
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  LOCATION = 'location',
  NOTICE = 'notice',
  SYSTEM = 'system',
}

export enum ReceiverType {
  USER = 'user',
  GROUP = 'group',
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  WITHDRAWN = 'withdrawn',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  // @ManyToOne(() => User, { nullable: true })
  // receiver: User;
  @ManyToOne(() => Group)
  group: Group;

  @Column({
    type: 'enum',
    enum: ReceiverType,
    default: ReceiverType.USER,
  })
  receiver_type: ReceiverType;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENDING,
  })
  status: MessageStatus;

  @Column({ default: false })
  is_withdrawn: boolean;

  @Column({ nullable: true })
  quoted_message_id?: number;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
