import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class OrderItem {
    id: number;
    quantity: number;
    price: number;
    productName: string;
    order: Order;
    orderId: number;
    product: Product;
    productId: number;
}
