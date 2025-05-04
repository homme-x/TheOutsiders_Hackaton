export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    images?: string[];
    mainImage?: string;
    featured?: boolean;
    discount?: number;
    categoryId: number;
    vendorId: number;
}
