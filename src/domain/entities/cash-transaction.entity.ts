export enum CashTransactionType {
    SALE_INCOME = 'SALE_INCOME',
    SALE_INCOME_CARD = 'SALE_INCOME_CARD',
    PAYMENT_TO_SUPPLIER = 'PAYMENT_TO_SUPPLIER',
    PAYMENT_FROM_CLIENT = 'PAYMENT_FROM_CLIENT',
    EXPENSE = 'EXPENSE',
    ADJUSTMENT = 'ADJUSTMENT',
    TRANSFER_TO_SAFE = 'TRANSFER_TO_SAFE',
    TRANSFER_FROM_SAFE = 'TRANSFER_FROM_SAFE',
    CARD_TO_SAFE = 'CARD_TO_SAFE',
    SAFE_TO_CARD = 'SAFE_TO_CARD',
    PAYOUT_CASH = 'PAYOUT_CASH',
    PAYOUT_SAFE = 'PAYOUT_SAFE',
    PAYOUT_CARD = 'PAYOUT_CARD',
}

export class CashTransactionEntity {
    constructor(
        public readonly id: string,
        public readonly cashRegisterId: string,
        public readonly type: CashTransactionType,
        public readonly amount: number,
        public readonly description: string | null,
        public readonly counterpartyId: string | null,
        public readonly relatedId: string | null,
        public readonly createdAt: Date,
    ) { }

    static create(props: {
        id: string;
        cashRegisterId: string;
        type: CashTransactionType;
        amount: number;
        description?: string | null;
        counterpartyId?: string | null;
        relatedId?: string | null;
        createdAt?: Date;
    }): CashTransactionEntity {
        return new CashTransactionEntity(
            props.id,
            props.cashRegisterId,
            props.type,
            Number(props.amount),
            props.description ?? null,
            props.counterpartyId ?? null,
            props.relatedId ?? null,
            props.createdAt ?? new Date(),
        );
    }
}
