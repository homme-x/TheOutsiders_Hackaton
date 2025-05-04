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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(createProductDto) {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }
    async findAll(options) {
        const query = this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.vendor', 'vendor')
            .where('product.isActive = :isActive', { isActive: true });
        if (options === null || options === void 0 ? void 0 : options.featured) {
            query.andWhere('product.featured = :featured', { featured: options.featured });
        }
        if (options === null || options === void 0 ? void 0 : options.categoryId) {
            query.andWhere('product.categoryId = :categoryId', { categoryId: options.categoryId });
        }
        if (options === null || options === void 0 ? void 0 : options.vendorId) {
            query.andWhere('product.vendorId = :vendorId', { vendorId: options.vendorId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'vendor'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Produit avec l'ID ${id} non trouvé`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        const updatedProduct = this.productsRepository.merge(product, updateProductDto);
        return this.productsRepository.save(updatedProduct);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        if (product.stock < quantity) {
            throw new Error('Stock insuffisant');
        }
        product.stock -= quantity;
        return this.productsRepository.save(product);
    }
    async search(query) {
        return this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.isActive = :isActive', { isActive: true })
            .andWhere('(product.name LIKE :query OR product.description LIKE :query)', { query: `%${query}%` })
            .getMany();
    }
    async getFeaturedProducts() {
        return this.findAll({ featured: true });
    }
    async getProductsByCategory(categoryId) {
        return this.findAll({ categoryId });
    }
    async getProductsByVendor(vendorId) {
        return this.findAll({ vendorId });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map