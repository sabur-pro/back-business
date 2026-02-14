import { CounterpartyEntity } from '../entities/counterparty.entity';
import { CounterpartyTransactionEntity } from '../entities/counterparty-transaction.entity';

export interface CreateCounterpartyData {
    name: string;
    phone?: string | null;
    note?: string | null;
    type: string;
    accountId: string;
}

export interface UpdateCounterpartyData {
    name?: string;
    phone?: string | null;
    note?: string | null;
    isActive?: boolean;
}

export interface CreateCounterpartyTransactionData {
    counterpartyId: string;
    type: string;
    amount: number;
    description?: string | null;
    relatedId?: string | null;
}

export interface CounterpartySearchParams {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
}

export interface PaginatedCounterparties {
    items: CounterpartyEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedCounterpartyTransactions {
    items: CounterpartyTransactionEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ICounterpartyRepository {
    findById(id: string): Promise<CounterpartyEntity | null>;
    findByAccountId(accountId: string, params: CounterpartySearchParams): Promise<PaginatedCounterparties>;
    create(data: CreateCounterpartyData): Promise<CounterpartyEntity>;
    update(id: string, data: UpdateCounterpartyData): Promise<CounterpartyEntity>;
    updateBalance(id: string, amount: number): Promise<CounterpartyEntity>;
    findTransactions(counterpartyId: string, params: { page?: number; limit?: number }): Promise<PaginatedCounterpartyTransactions>;
    createTransaction(data: CreateCounterpartyTransactionData): Promise<CounterpartyTransactionEntity>;
}

export const COUNTERPARTY_REPOSITORY = Symbol('ICounterpartyRepository');
