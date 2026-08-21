import { ProductEntity } from './product.entity';

export enum ArrivalSource {
    SHIPMENT = 'SHIPMENT',
    RECEIPT = 'RECEIPT',
    MANUAL = 'MANUAL',
}

/**
 * Product Arrival Entity
 * Партия поступления товара: сколько и когда пришло,
 * сколько из партии продано и сколько возвращено.
 */
export class ProductArrivalEntity {
    constructor(
        public readonly id: string,
        public readonly accountId: string,
        public readonly warehouseId: string,
        public readonly productId: string | null,
        public readonly sku: string,
        public readonly photo: string | null,
        public readonly sizeRange: string | null,
        public readonly boxCount: number,
        public readonly pairCount: number,
        public readonly soldBoxes: number,
        public readonly soldPairs: number,
        public readonly returnedBoxes: number,
        public readonly returnedPairs: number,
        public readonly priceYuan: number,
        public readonly priceRub: number,
        public readonly recommendedSalePrice: number,
        public readonly sourceType: ArrivalSource,
        public readonly sourceId: string | null,
        public readonly arrivedAt: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly product?: ProductEntity | null,
    ) { }

    /** Сколько коробок из партии ещё не продано и не возвращено */
    get remainderBoxes(): number {
        return Math.max(0, this.boxCount - this.soldBoxes - this.returnedBoxes);
    }

    /** Сколько пар из партии ещё не продано и не возвращено */
    get remainderPairs(): number {
        return Math.max(0, this.pairCount - this.soldPairs - this.returnedPairs);
    }

    static create(props: {
        id: string;
        accountId: string;
        warehouseId: string;
        productId?: string | null;
        sku: string;
        photo?: string | null;
        sizeRange?: string | null;
        boxCount?: number;
        pairCount?: number;
        soldBoxes?: number;
        soldPairs?: number;
        returnedBoxes?: number;
        returnedPairs?: number;
        priceYuan: number;
        priceRub: number;
        recommendedSalePrice?: number;
        sourceType?: ArrivalSource;
        sourceId?: string | null;
        arrivedAt: Date;
        createdAt?: Date;
        updatedAt?: Date;
        product?: ProductEntity | null;
    }): ProductArrivalEntity {
        return new ProductArrivalEntity(
            props.id,
            props.accountId,
            props.warehouseId,
            props.productId ?? null,
            props.sku,
            props.photo ?? null,
            props.sizeRange ?? null,
            props.boxCount ?? 0,
            props.pairCount ?? 0,
            props.soldBoxes ?? 0,
            props.soldPairs ?? 0,
            props.returnedBoxes ?? 0,
            props.returnedPairs ?? 0,
            Number(props.priceYuan),
            Number(props.priceRub),
            Number(props.recommendedSalePrice ?? 0),
            props.sourceType ?? ArrivalSource.SHIPMENT,
            props.sourceId ?? null,
            props.arrivedAt,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
            props.product ?? null,
        );
    }
}
