import { User } from '../../users/entities/user.entity';
export declare class Message {
    id: number;
    content: string;
    isRead: boolean;
    createdAt: Date;
    sender: User;
    senderId: number;
    receiver: User;
    receiverId: number;
    conversationId: string;
}
