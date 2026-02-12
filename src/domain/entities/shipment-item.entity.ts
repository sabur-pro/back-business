export class ShipmentItemEntity {
    constructor(
        public readonly id: string,
        public readonly transferId: string,
        public readonly productId: string,
        public readonly sku: string,
        public readonly photo: string | null,
        public readonly sizeRange: string | null,
        public readonly boxCount: number,
        public readonly pairCount: number,
        public readonly priceYuan: number,
        public readonly priceRub: number,
        public readonly totalYuan: number,
        public readonly totalRub: number,
    ) { }

    static create(props: {
        id: string;
        transferId: string;
        productId: string;
        sku: string;
        photo?: string | null;
        sizeRange?: string | null;
        boxCount?: number;
        pairCount?: number;
        priceYuan: number;
        priceRub: number;
        totalYuan: number;
        totalRub: number;
    }): ShipmentItemEntity {
        return new ShipmentItemEntity(
            props.id,
            props.transferId,
            props.productId,
            props.sku,
            props.photo ?? null,
            props.sizeRange ?? null,
            props.boxCount ?? 0,
            props.pairCount ?? 0,
            Number(props.priceYuan),
            Number(props.priceRub),
            Number(props.totalYuan),
            Number(props.totalRub),
        );
    }
}
