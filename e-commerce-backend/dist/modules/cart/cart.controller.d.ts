import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(addToCartDto: AddToCartDto, req: any): Promise<import("./entities/cart-item.entity").CartItem>;
    getUserCart(req: any): Promise<import("./entities/cart-item.entity").CartItem[]>;
    getCartTotal(req: any): Promise<number>;
    updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto): Promise<import("./entities/cart-item.entity").CartItem>;
    removeCartItem(id: string): Promise<void>;
    clearCart(req: any): Promise<void>;
}
