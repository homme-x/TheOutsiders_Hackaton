import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';
export declare class CartService {
    private cartItemsRepository;
    private productsService;
    constructor(cartItemsRepository: Repository<CartItem>, productsService: ProductsService);
    addToCart(userId: number, addToCartDto: AddToCartDto): Promise<CartItem>;
    getUserCart(userId: number): Promise<CartItem[]>;
    getCartItem(id: number): Promise<CartItem>;
    updateCartItem(id: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem>;
    removeCartItem(id: number): Promise<void>;
    clearCart(userId: number): Promise<void>;
    getCartTotal(userId: number): Promise<number>;
}
