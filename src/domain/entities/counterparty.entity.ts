export enum CounterpartyType {
    SUPPLIER = 'SUPPLIER',
    CLIENT = 'CLIENT',
}

export class CounterpartyEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly phone: string | null,
        public readonly note: string | null,
        public readonly type: CounterpartyType,
        public readonly accountId: string,
        public readonly balance: number,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(props: {
        id: string;
        name: string;
        phone?: string | null;
        note?: string | null;
        type: CounterpartyType;
        accountId: string;
        balance?: number;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): CounterpartyEntity {
        return new CounterpartyEntity(
            props.id,
            props.name,
            props.phone ?? null,
            props.note ?? null,
            props.type,
            props.accountId,
            Number(props.balance ?? 0),
            props.isActive ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
