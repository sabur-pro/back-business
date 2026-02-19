import { ProductEntity } from '../entities/product.entity';

export interface ProductSearchParams {
    page?: number;
    limit?: number;
    search?: string;
    zeroBoxes?: boolean;
}

export interface ProductStats {
    uniqueProducts: number;
    totalBoxes: number;
    totalPairs: number;
}

export interface PaginatedProducts {
    items: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateProductData {
    sku: string;
    photoOriginal?: string | null;
    photo?: string | null;
    sizeRange?: string | null;
    boxCount?: number;
    pairCount?: number;
    priceYuan: number;
    priceRub: number;
    totalYuan: number;
    totalRub: number;
    recommendedSalePrice?: number;
    totalRecommendedSale?: number;
    actualSalePrice?: number;
    totalActualSale?: number;
    barcode?: string | null;
    accountId: string;
    warehouseId?: string | null;
    isActive?: boolean;
}

export interface UpdateProductData {
    sku?: string;
    photoOriginal?: string | null;
    photo?: string | null;
    sizeRange?: string | null;
    boxCount?: number;
    pairCount?: number;
    priceYuan?: number;
    priceRub?: number;
    totalYuan?: number;
    totalRub?: number;
    recommendedSalePrice?: number;
    totalRecommendedSale?: number;
    actualSalePrice?: number;
    totalActualSale?: number;
    barcode?: string | null;
    isActive?: boolean;
}

/**
 * Product Repository Interface
 */
export interface IProductRepository {
    findById(id: string): Promise<ProductEntity | null>;
    findByAccountId(accountId: string): Promise<ProductEntity[]>;
    findByAccountIdPaginated(accountId: string, params: ProductSearchParams): Promise<PaginatedProducts>;
    findByWarehouseIdPaginated(warehouseId: string, params: ProductSearchParams): Promise<PaginatedProducts>;
    findByPointIdPaginated(pointId: string, params: ProductSearchParams): Promise<PaginatedProducts>;
    findAllByUserPaginated(accountIds: string[], params: ProductSearchParams): Promise<PaginatedProducts>;
    getStatsByAccountIds(accountIds: string[]): Promise<ProductStats>;
    findBySkuAndAccountId(sku: string, accountId: string, warehouseId?: string | null): Promise<ProductEntity | null>;
    create(data: CreateProductData): Promise<ProductEntity>;
    createMany(data: CreateProductData[]): Promise<ProductEntity[]>;
    update(id: string, data: UpdateProductData): Promise<ProductEntity>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<number>;
}

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
