import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class CartItem {
    id: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: number;
    product: Product;
    productId: number;
}
