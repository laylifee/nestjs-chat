import { User } from '../../user/entities/user.entity';

export interface MessageEvent {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
  };
  receiver: {
    id: number;
    username: string;
  };
  createdAt: Date;
}

export interface MessageStatusEvent {
  messageId: number;
  status: 'delivered' | 'read';
  updatedAt: Date;
}
