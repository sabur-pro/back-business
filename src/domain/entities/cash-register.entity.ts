export class CashRegisterEntity {
    constructor(
        public readonly id: string,
        public readonly shopId: string,
        public readonly balance: number,
        public readonly cardBalance: number,
        public readonly safeBalance: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly shopName?: string,
    ) { }

    static create(props: {
        id: string;
        shopId: string;
        balance?: number;
        cardBalance?: number;
        safeBalance?: number;
        createdAt?: Date;
        updatedAt?: Date;
        shopName?: string;
    }): CashRegisterEntity {
        return new CashRegisterEntity(
            props.id,
            props.shopId,
            Number(props.balance ?? 0),
            Number(props.cardBalance ?? 0),
            Number(props.safeBalance ?? 0),
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
            props.shopName,
        );
    }
}
