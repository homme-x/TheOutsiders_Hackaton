import { OrderStatus } from '../entities/order.entity';
export declare class UpdateOrderDto {
    status?: OrderStatus;
    shippingAddress?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
    paymentMethod?: string;
    paymentId?: string;
    isPaid?: boolean;
    paidAt?: Date;
    deliveredAt?: Date;
}
