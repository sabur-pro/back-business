import { PrismaService } from '../prisma/prisma.service';
import { IAccountRepository, CreateAccountData, UpdateAccountData } from '@domain/repositories/account.repository.interface';
import { AccountEntity } from '@domain/entities/account.entity';
export declare class AccountRepository implements IAccountRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<AccountEntity | null>;
    findAll(): Promise<AccountEntity[]>;
    findByOwnerId(ownerId: string): Promise<AccountEntity[]>;
    create(data: CreateAccountData): Promise<AccountEntity>;
    update(id: string, data: UpdateAccountData): Promise<AccountEntity>;
    delete(id: string): Promise<void>;
}
