import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(options?: {
        featured?: boolean;
        categoryId?: number;
        vendorId?: number;
    }): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
    updateStock(id: number, quantity: number): Promise<Product>;
    search(query: string): Promise<Product[]>;
    getFeaturedProducts(): Promise<Product[]>;
    getProductsByCategory(categoryId: number): Promise<Product[]>;
    getProductsByVendor(vendorId: number): Promise<Product[]>;
}
