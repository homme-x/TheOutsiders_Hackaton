import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    mainImage: string;
    featured: boolean;
    discount: number;
    rating: number;
    reviewCount: number;
    likes: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    vendor: User;
    vendorId: number;
    category: Category;
    categoryId: number;
}
