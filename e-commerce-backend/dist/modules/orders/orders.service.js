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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, productsService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.productsService = productsService;
    }
    async create(createOrderDto) {
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        let total = 0;
        for (const item of createOrderDto.orderItems) {
            total += item.price * item.quantity;
            await this.productsService.updateStock(item.productId, item.quantity);
        }
        const order = this.ordersRepository.create({
            orderNumber,
            userId: createOrderDto.userId,
            total,
            status: createOrderDto.status || order_entity_1.OrderStatus.PENDING,
            shippingAddress: createOrderDto.shippingAddress,
            shippingCity: createOrderDto.shippingCity,
            shippingPostalCode: createOrderDto.shippingPostalCode,
            shippingCountry: createOrderDto.shippingCountry,
            paymentMethod: createOrderDto.paymentMethod,
        });
        const savedOrder = await this.ordersRepository.save(order);
        for (const item of createOrderDto.orderItems) {
            const product = await this.productsService.findOne(item.productId);
            const orderItem = this.orderItemsRepository.create({
                orderId: savedOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                productName: product.name,
            });
            await this.orderItemsRepository.save(orderItem);
        }
        return this.findOne(savedOrder.id);
    }
    async findAll() {
        return this.ordersRepository.find({
            relations: ['orderItems', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.ordersRepository.find({
            where: { userId },
            relations: ['orderItems'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['orderItems', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Commande avec l'ID ${id} non trouvée`);
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.ordersRepository.findOne({
            where: { orderNumber },
            relations: ['orderItems', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Commande avec le numéro ${orderNumber} non trouvée`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        const updatedOrder = this.ordersRepository.merge(order, updateOrderDto);
        return this.ordersRepository.save(updatedOrder);
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        order.status = status;
        if (status === order_entity_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
        }
        return this.ordersRepository.save(order);
    }
    async markAsPaid(id, paymentId) {
        const order = await this.findOne(id);
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentId = paymentId;
        return this.ordersRepository.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map