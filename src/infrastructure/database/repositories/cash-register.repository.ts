import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    ICashRegisterRepository,
    CreateCashTransactionData,
    PaginatedCashTransactions,
} from '@domain/repositories/cash-register.repository.interface';
import { CashRegisterEntity } from '@domain/entities/cash-register.entity';
import { CashTransactionEntity, CashTransactionType } from '@domain/entities/cash-transaction.entity';

@Injectable()
export class CashRegisterRepository implements ICashRegisterRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByShopId(shopId: string): Promise<CashRegisterEntity | null> {
        const register = await this.prisma.cashRegister.findUnique({
            where: { shopId },
            include: {
                shop: { select: { id: true, name: true } },
            },
        });

        if (!register) return null;

        return this.mapToEntity(register);
    }

    async findOrCreateByShopId(shopId: string): Promise<CashRegisterEntity> {
        let register = await this.prisma.cashRegister.findUnique({
            where: { shopId },
            include: {
                shop: { select: { id: true, name: true } },
            },
        });

        if (!register) {
            register = await this.prisma.cashRegister.create({
                data: { shopId },
                include: {
                    shop: { select: { id: true, name: true } },
                },
            });
        }

        return this.mapToEntity(register);
    }

    async updateBalance(id: string, amount: number): Promise<CashRegisterEntity> {
        const register = await this.prisma.cashRegister.update({
            where: { id },
            data: {
                balance: { increment: amount },
            },
            include: {
                shop: { select: { id: true, name: true } },
            },
        });

        return this.mapToEntity(register);
    }

    async updateCardBalance(id: string, amount: number): Promise<CashRegisterEntity> {
        const register = await this.prisma.cashRegister.update({
            where: { id },
            data: {
                cardBalance: { increment: amount },
            },
            include: {
                shop: { select: { id: true, name: true } },
            },
        });

        return this.mapToEntity(register);
    }

    async updateSafeBalance(id: string, amount: number): Promise<CashRegisterEntity> {
        const register = await this.prisma.cashRegister.update({
            where: { id },
            data: {
                safeBalance: { increment: amount },
            },
            include: {
                shop: { select: { id: true, name: true } },
            },
        });

        return this.mapToEntity(register);
    }

    async findTransactions(
        cashRegisterId: string,
        params: { page?: number; limit?: number },
    ): Promise<PaginatedCashTransactions> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where = { cashRegisterId };

        const [items, total] = await Promise.all([
            this.prisma.cashTransaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.cashTransaction.count({ where }),
        ]);

        return {
            items: items.map((t) => this.mapTransactionToEntity(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async createTransaction(data: CreateCashTransactionData): Promise<CashTransactionEntity> {
        const transaction = await this.prisma.cashTransaction.create({
            data: {
                cashRegisterId: data.cashRegisterId,
                type: data.type as any,
                amount: data.amount,
                description: data.description,
                counterpartyId: data.counterpartyId,
                relatedId: data.relatedId,
            },
        });

        return this.mapTransactionToEntity(transaction);
    }

    private mapToEntity(register: any): CashRegisterEntity {
        return CashRegisterEntity.create({
            id: register.id,
            shopId: register.shopId,
            balance: register.balance,
            cardBalance: register.cardBalance,
            safeBalance: register.safeBalance,
            createdAt: register.createdAt,
            updatedAt: register.updatedAt,
            shopName: register.shop?.name,
        });
    }

    private mapTransactionToEntity(transaction: any): CashTransactionEntity {
        return CashTransactionEntity.create({
            id: transaction.id,
            cashRegisterId: transaction.cashRegisterId,
            type: transaction.type as CashTransactionType,
            amount: transaction.amount,
            description: transaction.description,
            counterpartyId: transaction.counterpartyId,
            relatedId: transaction.relatedId,
            createdAt: transaction.createdAt,
        });
    }
}
