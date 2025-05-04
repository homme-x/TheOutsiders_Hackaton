import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private productsService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, productsService: ProductsService);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findByUser(userId: number): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    findByOrderNumber(orderNumber: string): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, status: OrderStatus): Promise<Order>;
    markAsPaid(id: number, paymentId: string): Promise<Order>;
}
