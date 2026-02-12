import { AccountEntity } from '../entities/account.entity';

export interface CreateAccountData {
    name: string;
    ownerId: string;
    isActive?: boolean;
}

export interface UpdateAccountData {
    name?: string;
    isActive?: boolean;
}

/**
 * Account Repository Interface
 */
export interface IAccountRepository {
    findById(id: string): Promise<AccountEntity | null>;
    findAll(): Promise<AccountEntity[]>;
    findByOwnerId(ownerId: string): Promise<AccountEntity[]>;
    create(data: CreateAccountData): Promise<AccountEntity>;
    update(id: string, data: UpdateAccountData): Promise<AccountEntity>;
    delete(id: string): Promise<void>;
}

export const ACCOUNT_REPOSITORY = Symbol('IAccountRepository');
