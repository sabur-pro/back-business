export declare enum WarehouseType {
    WAREHOUSE = "WAREHOUSE",
    SHOP = "SHOP"
}
export declare class WarehouseEntity {
    readonly id: string;
    readonly name: string;
    readonly type: WarehouseType;
    readonly pointId: string;
    readonly address: string | null;
    readonly description: string | null;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, name: string, type: WarehouseType, pointId: string, address: string | null, description: string | null, isActive: boolean, createdAt: Date, updatedAt: Date);
    static create(props: {
        id: string;
        name: string;
        type?: WarehouseType;
        pointId: string;
        address?: string | null;
        description?: string | null;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): WarehouseEntity;
}
