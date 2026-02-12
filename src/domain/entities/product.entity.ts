/**
 * Product Entity
 * Represents a product in the organization catalog
 */
export class ProductEntity {
    constructor(
        public readonly id: string,
        public readonly sku: string,
        public readonly photoOriginal: string | null,
        public readonly photo: string | null,
        public readonly sizeRange: string | null,
        public readonly boxCount: number,
        public readonly pairCount: number,
        public readonly priceYuan: number,
        public readonly priceRub: number,
        public readonly totalYuan: number,
        public readonly totalRub: number,
        public readonly recommendedSalePrice: number,
        public readonly totalRecommendedSale: number,
        public readonly actualSalePrice: number,
        public readonly totalActualSale: number,
        public readonly barcode: string | null,
        public readonly accountId: string,
        public readonly warehouseId: string | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(props: {
        id: string;
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
        createdAt?: Date;
        updatedAt?: Date;
    }): ProductEntity {
        return new ProductEntity(
            props.id,
            props.sku,
            props.photoOriginal ?? null,
            props.photo ?? null,
            props.sizeRange ?? null,
            props.boxCount ?? 0,
            props.pairCount ?? 0,
            Number(props.priceYuan),
            Number(props.priceRub),
            Number(props.totalYuan),
            Number(props.totalRub),
            Number(props.recommendedSalePrice ?? 0),
            Number(props.totalRecommendedSale ?? 0),
            Number(props.actualSalePrice ?? 0),
            Number(props.totalActualSale ?? 0),
            props.barcode ?? null,
            props.accountId,
            props.warehouseId ?? null,
            props.isActive ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
