import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    image: string;
    slug: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}
