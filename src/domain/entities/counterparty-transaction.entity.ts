export enum CounterpartyTransactionType {
    GOODS_RECEIVED = 'GOODS_RECEIVED',
    GOODS_SOLD = 'GOODS_SOLD',
    PAYMENT_OUT = 'PAYMENT_OUT',
    PAYMENT_IN = 'PAYMENT_IN',
}

export class CounterpartyTransactionEntity {
    constructor(
        public readonly id: string,
        public readonly counterpartyId: string,
        public readonly type: CounterpartyTransactionType,
        public readonly amount: number,
        public readonly description: string | null,
        public readonly relatedId: string | null,
        public readonly createdAt: Date,
    ) { }

    static create(props: {
        id: string;
        counterpartyId: string;
        type: CounterpartyTransactionType;
        amount: number;
        description?: string | null;
        relatedId?: string | null;
        createdAt?: Date;
    }): CounterpartyTransactionEntity {
        return new CounterpartyTransactionEntity(
            props.id,
            props.counterpartyId,
            props.type,
            Number(props.amount),
            props.description ?? null,
            props.relatedId ?? null,
            props.createdAt ?? new Date(),
        );
    }
}
