import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(featured?: boolean, categoryId?: number, vendorId?: number): Promise<import("./entities/product.entity").Product[]>;
    search(query: string): Promise<import("./entities/product.entity").Product[]>;
    getFeaturedProducts(): Promise<import("./entities/product.entity").Product[]>;
    getProductsByCategory(categoryId: string): Promise<import("./entities/product.entity").Product[]>;
    getProductsByVendor(vendorId: string): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
