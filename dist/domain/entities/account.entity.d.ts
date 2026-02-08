export declare class AccountEntity {
    readonly id: string;
    readonly name: string;
    readonly ownerId: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, name: string, ownerId: string, isActive: boolean, createdAt: Date, updatedAt: Date);
    static create(props: {
        id: string;
        name: string;
        ownerId: string;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): AccountEntity;
}
