import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    paymentMethod: string;
    paymentId: string;
    isPaid: boolean;
    paidAt: Date;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: number;
    orderItems: OrderItem[];
}
