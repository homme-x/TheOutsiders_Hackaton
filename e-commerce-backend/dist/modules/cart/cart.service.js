"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(cartItemsRepository, productsService) {
        this.cartItemsRepository = cartItemsRepository;
        this.productsService = productsService;
    }
    async addToCart(userId, addToCartDto) {
        const product = await this.productsService.findOne(addToCartDto.productId);
        const existingCartItem = await this.cartItemsRepository.findOne({
            where: {
                userId,
                productId: addToCartDto.productId,
            },
        });
        if (existingCartItem) {
            existingCartItem.quantity += addToCartDto.quantity;
            return this.cartItemsRepository.save(existingCartItem);
        }
        const cartItem = this.cartItemsRepository.create({
            userId,
            productId: addToCartDto.productId,
            quantity: addToCartDto.quantity,
        });
        return this.cartItemsRepository.save(cartItem);
    }
    async getUserCart(userId) {
        return this.cartItemsRepository.find({
            where: { userId },
            relations: ['product'],
        });
    }
    async getCartItem(id) {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id },
            relations: ['product'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException(`Élément de panier avec l'ID ${id} non trouvé`);
        }
        return cartItem;
    }
    async updateCartItem(id, updateCartItemDto) {
        const cartItem = await this.getCartItem(id);
        cartItem.quantity = updateCartItemDto.quantity;
        return this.cartItemsRepository.save(cartItem);
    }
    async removeCartItem(id) {
        const cartItem = await this.getCartItem(id);
        await this.cartItemsRepository.remove(cartItem);
    }
    async clearCart(userId) {
        await this.cartItemsRepository.delete({ userId });
    }
    async getCartTotal(userId) {
        const cartItems = await this.getUserCart(userId);
        let total = 0;
        for (const item of cartItems) {
            const product = await this.productsService.findOne(item.productId);
            total += product.price * item.quantity;
        }
        return total;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map