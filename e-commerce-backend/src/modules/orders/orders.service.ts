import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Générer un numéro de commande unique
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Calculer le total de la commande
    let total = 0;
    for (const item of createOrderDto.orderItems) {
      total += item.price * item.quantity;
      
      // Mettre à jour le stock du produit
      await this.productsService.updateStock(item.productId, item.quantity);
    }
    
    // Créer la commande
    const order = this.ordersRepository.create({
      orderNumber,
      userId: createOrderDto.userId,
      total,
      status: createOrderDto.status || OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      shippingCity: createOrderDto.shippingCity,
      shippingPostalCode: createOrderDto.shippingPostalCode,
      shippingCountry: createOrderDto.shippingCountry,
      paymentMethod: createOrderDto.paymentMethod,
    });
    
    // Sauvegarder la commande
    const savedOrder = await this.ordersRepository.save(order);
    
    // Créer les éléments de la commande
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
    
    // Retourner la commande avec les éléments
    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['orderItems', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['orderItems'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderItems', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
    
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { orderNumber },
      relations: ['orderItems', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException(`Commande avec le numéro ${orderNumber} non trouvée`);
    }
    
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    // Mettre à jour la commande
    const updatedOrder = this.ordersRepository.merge(order, updateOrderDto);
    return this.ordersRepository.save(updatedOrder);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    
    // Si la commande est livrée, mettre à jour la date de livraison
    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    
    return this.ordersRepository.save(order);
  }

  async markAsPaid(id: number, paymentId: string): Promise<Order> {
    const order = await this.findOne(id);
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentId = paymentId;
    
    return this.ordersRepository.save(order);
  }
}
