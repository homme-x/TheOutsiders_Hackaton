import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { Message } from '../../messages/entities/message.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
export declare const UserRole: {
    ADMIN: string;
    VENDOR: string;
    CUSTOMER: string;
};
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isVerified: boolean;
    isActive: boolean;
    lastLogin: Date;
    isAvailable: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
    orders: Order[];
    sentMessages: Message[];
    receivedMessages: Message[];
    cartItems: CartItem[];
}
