/**
 * Point Entity
 * Represents a business location/branch
 */
export class PointEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly address: string | null,
        public readonly accountId: string,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(props: {
        id: string;
        name: string;
        address?: string | null;
        accountId: string;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): PointEntity {
        return new PointEntity(
            props.id,
            props.name,
            props.address ?? null,
            props.accountId,
            props.isActive ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
