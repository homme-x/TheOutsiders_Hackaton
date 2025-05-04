"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const users_service_1 = require("../users/users.service");
let MessagesService = class MessagesService {
    constructor(messagesRepository, usersService) {
        this.messagesRepository = messagesRepository;
        this.usersService = usersService;
    }
    async create(senderId, createMessageDto) {
        await this.usersService.findOne(senderId);
        await this.usersService.findOne(createMessageDto.receiverId);
        let conversationId = createMessageDto.conversationId;
        if (!conversationId) {
            const participants = [senderId, createMessageDto.receiverId].sort().join('-');
            conversationId = `conv-${participants}`;
        }
        const message = this.messagesRepository.create({
            content: createMessageDto.content,
            senderId,
            receiverId: createMessageDto.receiverId,
            conversationId,
            isRead: false,
        });
        return this.messagesRepository.save(message);
    }
    async findAll() {
        return this.messagesRepository.find({
            relations: ['sender', 'receiver'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByConversation(conversationId) {
        return this.messagesRepository.find({
            where: { conversationId },
            relations: ['sender', 'receiver'],
            order: { createdAt: 'ASC' },
        });
    }
    async findUserConversations(userId) {
        const messages = await this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
            .orderBy('message.createdAt', 'DESC')
            .getMany();
        const conversationsMap = new Map();
        for (const message of messages) {
            if (!conversationsMap.has(message.conversationId)) {
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
            }
            else {
                if (message.receiverId === userId && !message.isRead) {
                    const conversation = conversationsMap.get(message.conversationId);
                    conversation.unreadCount += 1;
                }
            }
        }
        return Array.from(conversationsMap.values());
    }
    async findOne(id) {
        const message = await this.messagesRepository.findOne({
            where: { id },
            relations: ['sender', 'receiver'],
        });
        if (!message) {
            throw new common_1.NotFoundException(`Message avec l'ID ${id} non trouvé`);
        }
        return message;
    }
    async markAsRead(id) {
        const message = await this.findOne(id);
        message.isRead = true;
        return this.messagesRepository.save(message);
    }
    async markConversationAsRead(conversationId, userId) {
        await this.messagesRepository
            .createQueryBuilder()
            .update(message_entity_1.Message)
            .set({ isRead: true })
            .where('conversationId = :conversationId AND receiverId = :userId AND isRead = :isRead', {
            conversationId,
            userId,
            isRead: false,
        })
            .execute();
    }
    async remove(id) {
        const message = await this.findOne(id);
        await this.messagesRepository.remove(message);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map