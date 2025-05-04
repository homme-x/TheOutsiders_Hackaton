import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<CartItem> {
    // Vérifier si le produit existe
    const product = await this.productsService.findOne(addToCartDto.productId);
    
    // Vérifier si le produit est déjà dans le panier
    const existingCartItem = await this.cartItemsRepository.findOne({
      where: {
        userId,
        productId: addToCartDto.productId,
      },
    });
    
    if (existingCartItem) {
      // Mettre à jour la quantité
      existingCartItem.quantity += addToCartDto.quantity;
      return this.cartItemsRepository.save(existingCartItem);
    }
    
    // Créer un nouvel élément dans le panier
    const cartItem = this.cartItemsRepository.create({
      userId,
      productId: addToCartDto.productId,
      quantity: addToCartDto.quantity,
    });
    
    return this.cartItemsRepository.save(cartItem);
  }

  async getUserCart(userId: number): Promise<CartItem[]> {
    return this.cartItemsRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async getCartItem(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    
    if (!cartItem) {
      throw new NotFoundException(`Élément de panier avec l'ID ${id} non trouvé`);
    }
    
    return cartItem;
  }

  async updateCartItem(id: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const cartItem = await this.getCartItem(id);
    cartItem.quantity = updateCartItemDto.quantity;
    return this.cartItemsRepository.save(cartItem);
  }

  async removeCartItem(id: number): Promise<void> {
    const cartItem = await this.getCartItem(id);
    await this.cartItemsRepository.remove(cartItem);
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartItemsRepository.delete({ userId });
  }

  async getCartTotal(userId: number): Promise<number> {
    const cartItems = await this.getUserCart(userId);
    
    let total = 0;
    for (const item of cartItems) {
      const product = await this.productsService.findOne(item.productId);
      total += product.price * item.quantity;
    }
    
    return total;
  }
}
