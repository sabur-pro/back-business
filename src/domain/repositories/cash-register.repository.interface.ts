import { CashRegisterEntity } from '../entities/cash-register.entity';
import { CashTransactionEntity } from '../entities/cash-transaction.entity';

export interface CreateCashTransactionData {
    cashRegisterId: string;
    type: string;
    amount: number;
    description?: string | null;
    counterpartyId?: string | null;
    relatedId?: string | null;
}

export interface PaginatedCashTransactions {
    items: CashTransactionEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ICashRegisterRepository {
    findByShopId(shopId: string): Promise<CashRegisterEntity | null>;
    findOrCreateByShopId(shopId: string): Promise<CashRegisterEntity>;
    updateBalance(id: string, amount: number): Promise<CashRegisterEntity>;
    updateCardBalance(id: string, amount: number): Promise<CashRegisterEntity>;
    updateSafeBalance(id: string, amount: number): Promise<CashRegisterEntity>;
    findTransactions(cashRegisterId: string, params: { page?: number; limit?: number }): Promise<PaginatedCashTransactions>;
    createTransaction(data: CreateCashTransactionData): Promise<CashTransactionEntity>;
}

export const CASH_REGISTER_REPOSITORY = Symbol('ICashRegisterRepository');
