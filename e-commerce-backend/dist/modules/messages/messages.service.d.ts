import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';
export declare class MessagesService {
    private messagesRepository;
    private usersService;
    constructor(messagesRepository: Repository<Message>, usersService: UsersService);
    create(senderId: number, createMessageDto: CreateMessageDto): Promise<Message>;
    findAll(): Promise<Message[]>;
    findByConversation(conversationId: string): Promise<Message[]>;
    findUserConversations(userId: number): Promise<any[]>;
    findOne(id: number): Promise<Message>;
    markAsRead(id: number): Promise<Message>;
    markConversationAsRead(conversationId: string, userId: number): Promise<void>;
    remove(id: number): Promise<void>;
}
