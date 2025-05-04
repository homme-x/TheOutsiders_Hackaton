import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(options?: { featured?: boolean; categoryId?: number; vendorId?: number }): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .where('product.isActive = :isActive', { isActive: true });

    if (options?.featured) {
      query.andWhere('product.featured = :featured', { featured: options.featured });
    }

    if (options?.categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId: options.categoryId });
    }

    if (options?.vendorId) {
      query.andWhere('product.vendorId = :vendorId', { vendorId: options.vendorId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'vendor'],
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const updatedProduct = this.productsRepository.merge(product, updateProductDto);
    return this.productsRepository.save(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    
    if (product.stock < quantity) {
      throw new Error('Stock insuffisant');
    }
    
    product.stock -= quantity;
    return this.productsRepository.save(product);
  }

  async search(query: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('(product.name LIKE :query OR product.description LIKE :query)', { query: `%${query}%` })
      .getMany();
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.findAll({ featured: true });
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return this.findAll({ categoryId });
  }

  async getProductsByVendor(vendorId: number): Promise<Product[]> {
    return this.findAll({ vendorId });
  }
}
