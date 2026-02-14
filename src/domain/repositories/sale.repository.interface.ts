import { SaleEntity } from '../entities/sale.entity';

export interface CreateSaleItemData {
    productId: string;
    sku: string;
    photo?: string | null;
    sizeRange?: string | null;
    boxCount: number;
    pairCount: number;
    priceYuan: number;
    priceRub: number;
    totalYuan: number;
    totalRub: number;
    recommendedSalePrice: number;
    actualSalePrice: number;
    totalRecommended: number;
    totalActual: number;
    profit: number;
}

export interface CreateSaleData {
    number: string;
    pointId: string;
    shopId: string;
    accountId: string;
    clientId?: string | null;
    totalYuan: number;
    totalRub: number;
    totalRecommended: number;
    totalActual: number;
    paidAmount?: number;
    paymentMethod?: string;
    profit: number;
    note?: string | null;
    soldById?: string | null;
    items: CreateSaleItemData[];
}

export interface SaleSearchParams {
    page?: number;
    limit?: number;
    status?: string;
}

export interface PaginatedSales {
    items: SaleEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Sale Repository Interface
 */
export interface ISaleRepository {
    findById(id: string): Promise<SaleEntity | null>;
    findByShopId(shopId: string, params: SaleSearchParams): Promise<PaginatedSales>;
    findByAccountId(accountId: string, params: SaleSearchParams): Promise<PaginatedSales>;
    findByPointId(pointId: string, params: SaleSearchParams): Promise<PaginatedSales>;
    create(data: CreateSaleData): Promise<SaleEntity>;
    updateStatus(id: string, status: string): Promise<SaleEntity>;
    generateNumber(): Promise<string>;
}

export const SALE_REPOSITORY = Symbol('ISaleRepository');
