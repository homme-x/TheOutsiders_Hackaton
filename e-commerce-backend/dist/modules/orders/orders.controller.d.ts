import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    findMyOrders(req: any): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string, req: any): Promise<import("./entities/order.entity").Order>;
    findByOrderNumber(orderNumber: string): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: OrderStatus): Promise<import("./entities/order.entity").Order>;
    markAsPaid(id: string, paymentId: string): Promise<import("./entities/order.entity").Order>;
}
