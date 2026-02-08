/**
 * Account Entity
 * Represents a company/organization account
 */
export class AccountEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly ownerId: string,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(props: {
        id: string;
        name: string;
        ownerId: string;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): AccountEntity {
        return new AccountEntity(
            props.id,
            props.name,
            props.ownerId,
            props.isActive ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
