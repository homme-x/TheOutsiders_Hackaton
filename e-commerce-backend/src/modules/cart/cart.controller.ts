import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Get()
  getUserCart(@Request() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Get('total')
  getCartTotal(@Request() req) {
    return this.cartService.getCartTotal(req.user.id);
  }

  @Patch(':id')
  updateCartItem(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(+id, updateCartItemDto);
  }

  @Delete(':id')
  removeCartItem(@Param('id') id: string) {
    return this.cartService.removeCartItem(+id);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
