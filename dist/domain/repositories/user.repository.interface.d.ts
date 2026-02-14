import { UserEntity, UserRole } from '../entities/user.entity';
export interface CreateUserData {
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
}
export interface UpdateUserData {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    role?: UserRole;
    accountId?: string | null;
    canCreateShipment?: boolean;
    canReceiveShipment?: boolean;
    canSell?: boolean;
    canAddProducts?: boolean;
    canManageCounterparties?: boolean;
    isActive?: boolean;
}
export interface IUserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByAccountId(accountId: string): Promise<UserEntity[]>;
    create(data: CreateUserData): Promise<UserEntity>;
    update(id: string, data: UpdateUserData): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}
export declare const USER_REPOSITORY: unique symbol;
