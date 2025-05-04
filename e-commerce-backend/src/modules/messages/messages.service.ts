import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async create(senderId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    // Vérifier si l'expéditeur existe
    await this.usersService.findOne(senderId);
    
    // Vérifier si le destinataire existe
    await this.usersService.findOne(createMessageDto.receiverId);
    
    // Générer un ID de conversation si non fourni
    let conversationId = createMessageDto.conversationId;
    if (!conversationId) {
      // Créer un ID de conversation basé sur les IDs des participants (toujours dans le même ordre)
      const participants = [senderId, createMessageDto.receiverId].sort().join('-');
      conversationId = `conv-${participants}`;
    }
    
    // Créer le message
    const message = this.messagesRepository.create({
      content: createMessageDto.content,
      senderId,
      receiverId: createMessageDto.receiverId,
      conversationId,
      isRead: false,
    });
    
    return this.messagesRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messagesRepository.find({
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { conversationId },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }

  async findUserConversations(userId: number): Promise<any[]> {
    // Trouver toutes les conversations où l'utilisateur est impliqué
    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    
    // Regrouper les messages par conversation
    const conversationsMap = new Map();
    
    for (const message of messages) {
      if (!conversationsMap.has(message.conversationId)) {
        // Déterminer l'autre participant
        const otherUser = message.senderId === userId ? message.receiver : message.sender;
        
        conversationsMap.set(message.conversationId, {
          id: message.conversationId,
          participantId: otherUser.id,
          participantName: `${otherUser.firstName} ${otherUser.lastName}`,
          participantAvatar: otherUser.avatar,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: message.receiverId === userId && !message.isRead ? 1 : 0,
        });
      } else {
        // Mettre à jour le compteur de messages non lus
        if (message.receiverId === userId && !message.isRead) {
          const conversation = conversationsMap.get(message.conversationId);
          conversation.unreadCount += 1;
        }
      }
    }
    
    return Array.from(conversationsMap.values());
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    
    if (!message) {
      throw new NotFoundException(`Message avec l'ID ${id} non trouvé`);
    }
    
    return message;
  }

  async markAsRead(id: number): Promise<Message> {
    const message = await this.findOne(id);
    message.isRead = true;
    return this.messagesRepository.save(message);
  }

  async markConversationAsRead(conversationId: string, userId: number): Promise<void> {
    await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('conversationId = :conversationId AND receiverId = :userId AND isRead = :isRead', {
        conversationId,
        userId,
        isRead: false,
      })
      .execute();
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messagesRepository.remove(message);
  }
}
