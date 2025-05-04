import { OrderStatus } from '../entities/order.entity';
export declare class OrderItemDto {
    productId: number;
    quantity: number;
    price: number;
    productName?: string;
}
export declare class CreateOrderDto {
    userId: number;
    orderItems: OrderItemDto[];
    shippingAddress?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
    paymentMethod?: string;
    status?: OrderStatus;
}
