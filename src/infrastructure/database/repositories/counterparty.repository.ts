import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    ICounterpartyRepository,
    CreateCounterpartyData,
    UpdateCounterpartyData,
    CreateCounterpartyTransactionData,
    CounterpartySearchParams,
    PaginatedCounterparties,
    PaginatedCounterpartyTransactions,
} from '@domain/repositories/counterparty.repository.interface';
import { CounterpartyEntity, CounterpartyType } from '@domain/entities/counterparty.entity';
import { CounterpartyTransactionEntity, CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';

@Injectable()
export class CounterpartyRepository implements ICounterpartyRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<CounterpartyEntity | null> {
        const counterparty = await this.prisma.counterparty.findUnique({
            where: { id },
        });

        if (!counterparty) return null;

        return this.mapToEntity(counterparty);
    }

    async findByAccountId(accountId: string, params: CounterpartySearchParams): Promise<PaginatedCounterparties> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { accountId };
        if (params.type) {
            where.type = params.type;
        }
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { phone: { contains: params.search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.counterparty.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.counterparty.count({ where }),
        ]);

        return {
            items: items.map((c) => this.mapToEntity(c)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async create(data: CreateCounterpartyData): Promise<CounterpartyEntity> {
        const counterparty = await this.prisma.counterparty.create({
            data: {
                name: data.name,
                phone: data.phone,
                note: data.note,
                type: data.type as any,
                accountId: data.accountId,
            },
        });

        return this.mapToEntity(counterparty);
    }

    async update(id: string, data: UpdateCounterpartyData): Promise<CounterpartyEntity> {
        const counterparty = await this.prisma.counterparty.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.note !== undefined && { note: data.note }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        });

        return this.mapToEntity(counterparty);
    }

    async updateBalance(id: string, amount: number): Promise<CounterpartyEntity> {
        const counterparty = await this.prisma.counterparty.update({
            where: { id },
            data: {
                balance: { increment: amount },
            },
        });

        return this.mapToEntity(counterparty);
    }

    async findTransactions(
        counterpartyId: string,
        params: { page?: number; limit?: number },
    ): Promise<PaginatedCounterpartyTransactions> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where = { counterpartyId };

        const [items, total] = await Promise.all([
            this.prisma.counterpartyTransaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.counterpartyTransaction.count({ where }),
        ]);

        return {
            items: items.map((t) => this.mapTransactionToEntity(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async createTransaction(data: CreateCounterpartyTransactionData): Promise<CounterpartyTransactionEntity> {
        const transaction = await this.prisma.counterpartyTransaction.create({
            data: {
                counterpartyId: data.counterpartyId,
                type: data.type as any,
                amount: data.amount,
                description: data.description,
                relatedId: data.relatedId,
            },
        });

        return this.mapTransactionToEntity(transaction);
    }

    private mapToEntity(counterparty: any): CounterpartyEntity {
        return CounterpartyEntity.create({
            id: counterparty.id,
            name: counterparty.name,
            phone: counterparty.phone,
            note: counterparty.note,
            type: counterparty.type as CounterpartyType,
            accountId: counterparty.accountId,
            balance: counterparty.balance,
            isActive: counterparty.isActive,
            createdAt: counterparty.createdAt,
            updatedAt: counterparty.updatedAt,
        });
    }

    private mapTransactionToEntity(transaction: any): CounterpartyTransactionEntity {
        return CounterpartyTransactionEntity.create({
            id: transaction.id,
            counterpartyId: transaction.counterpartyId,
            type: transaction.type as CounterpartyTransactionType,
            amount: transaction.amount,
            description: transaction.description,
            relatedId: transaction.relatedId,
            createdAt: transaction.createdAt,
        });
    }
}
