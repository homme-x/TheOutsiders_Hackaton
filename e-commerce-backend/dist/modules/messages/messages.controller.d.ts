import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, req: any): Promise<import("./entities/message.entity").Message>;
    findUserConversations(req: any): Promise<any[]>;
    findByConversation(conversationId: string): Promise<import("./entities/message.entity").Message[]>;
    markConversationAsRead(conversationId: string, req: any): Promise<void>;
    findOne(id: string): Promise<import("./entities/message.entity").Message>;
    markAsRead(id: string): Promise<import("./entities/message.entity").Message>;
    remove(id: string): Promise<void>;
}
