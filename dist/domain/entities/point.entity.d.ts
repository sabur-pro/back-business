export declare class PointEntity {
    readonly id: string;
    readonly name: string;
    readonly address: string | null;
    readonly accountId: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, name: string, address: string | null, accountId: string, isActive: boolean, createdAt: Date, updatedAt: Date);
    static create(props: {
        id: string;
        name: string;
        address?: string | null;
        accountId: string;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): PointEntity;
}
