/**
 * SaleItem Entity
 * Represents a single item in a sale transaction
 */
export class SaleItemEntity {
    constructor(
        public readonly id: string,
        public readonly saleId: string,
        public readonly productId: string | null,
        public readonly sku: string,
        public readonly photo: string | null,
        public readonly sizeRange: string | null,
        public readonly boxCount: number,
        public readonly pairCount: number,
        public readonly priceYuan: number,
        public readonly priceRub: number,
        public readonly totalYuan: number,
        public readonly totalRub: number,
        public readonly recommendedSalePrice: number,
        public readonly actualSalePrice: number,
        public readonly totalRecommended: number,
        public readonly totalActual: number,
        public readonly profit: number,
    ) { }

    static create(props: {
        id: string;
        saleId: string;
        productId?: string | null;
        sku: string;
        photo?: string | null;
        sizeRange?: string | null;
        boxCount?: number;
        pairCount?: number;
        priceYuan: number;
        priceRub: number;
        totalYuan: number;
        totalRub: number;
        recommendedSalePrice: number;
        actualSalePrice: number;
        totalRecommended: number;
        totalActual: number;
        profit: number;
    }): SaleItemEntity {
        return new SaleItemEntity(
            props.id,
            props.saleId,
            props.productId ?? null,
            props.sku,
            props.photo ?? null,
            props.sizeRange ?? null,
            props.boxCount ?? 0,
            props.pairCount ?? 0,
            Number(props.priceYuan),
            Number(props.priceRub),
            Number(props.totalYuan),
            Number(props.totalRub),
            Number(props.recommendedSalePrice),
            Number(props.actualSalePrice),
            Number(props.totalRecommended),
            Number(props.totalActual),
            Number(props.profit),
        );
    }
}
