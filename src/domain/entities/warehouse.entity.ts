/**
 * Warehouse Entity
 * Represents a storage location within a point
 */
export class WarehouseEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly pointId: string,
        public readonly address: string | null,
        public readonly description: string | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(props: {
        id: string;
        name: string;
        pointId: string;
        address?: string | null;
        description?: string | null;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): WarehouseEntity {
        return new WarehouseEntity(
            props.id,
            props.name,
            props.pointId,
            props.address ?? null,
            props.description ?? null,
            props.isActive ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
