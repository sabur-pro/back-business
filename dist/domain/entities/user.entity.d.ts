export declare enum UserRole {
    ORGANIZER = "ORGANIZER",
    POINT_ADMIN = "POINT_ADMIN"
}
export declare class UserEntity {
    readonly id: string;
    readonly email: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone: string | null;
    readonly role: UserRole;
    readonly accountId: string | null;
    readonly canCreateShipment: boolean;
    readonly canReceiveShipment: boolean;
    readonly canSell: boolean;
    readonly canAddProducts: boolean;
    readonly canManageCounterparties: boolean;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, email: string, password: string, firstName: string, lastName: string, phone: string | null, role: UserRole, accountId: string | null, canCreateShipment: boolean, canReceiveShipment: boolean, canSell: boolean, canAddProducts: boolean, canManageCounterparties: boolean, isActive: boolean, createdAt: Date, updatedAt: Date);
    get fullName(): string;
    get isOrganizer(): boolean;
    get isPointAdmin(): boolean;
    static create(props: {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string | null;
        role?: UserRole;
        accountId?: string | null;
        canCreateShipment?: boolean;
        canReceiveShipment?: boolean;
        canSell?: boolean;
        canAddProducts?: boolean;
        canManageCounterparties?: boolean;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): UserEntity;
}
