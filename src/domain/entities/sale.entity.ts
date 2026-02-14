import { SaleItemEntity } from './sale-item.entity';

export enum SaleStatus {
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
}

/**
 * Sale Entity
 * Represents a sale transaction from a shop
 */
export class SaleEntity {
    constructor(
        public readonly id: string,
        public readonly number: string,
        public readonly pointId: string,
        public readonly shopId: string,
        public readonly accountId: string,
        public readonly clientId: string | null,
        public readonly totalYuan: number,
        public readonly totalRub: number,
        public readonly totalRecommended: number,
        public readonly totalActual: number,
        public readonly paidAmount: number,
        public readonly paymentMethod: PaymentMethod,
        public readonly profit: number,
        public readonly status: SaleStatus,
        public readonly note: string | null,
        public readonly soldById: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly items: SaleItemEntity[],
        public readonly shopName?: string,
        public readonly pointName?: string,
        public readonly soldByName?: string,
        public readonly clientName?: string,
    ) { }

    static create(props: {
        id: string;
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
        paymentMethod?: PaymentMethod;
        profit: number;
        status?: SaleStatus;
        note?: string | null;
        soldById?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
        items?: SaleItemEntity[];
        shopName?: string;
        pointName?: string;
        soldByName?: string;
        clientName?: string;
    }): SaleEntity {
        return new SaleEntity(
            props.id,
            props.number,
            props.pointId,
            props.shopId,
            props.accountId,
            props.clientId ?? null,
            Number(props.totalYuan),
            Number(props.totalRub),
            Number(props.totalRecommended),
            Number(props.totalActual),
            Number(props.paidAmount ?? 0),
            props.paymentMethod ?? PaymentMethod.CASH,
            Number(props.profit),
            props.status ?? SaleStatus.COMPLETED,
            props.note ?? null,
            props.soldById ?? null,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
            props.items ?? [],
            props.shopName,
            props.pointName,
            props.soldByName,
            props.clientName,
        );
    }
}
