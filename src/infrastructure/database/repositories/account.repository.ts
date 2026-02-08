import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IAccountRepository,
    CreateAccountData,
    UpdateAccountData,
} from '@domain/repositories/account.repository.interface';
import { AccountEntity } from '@domain/entities/account.entity';

@Injectable()
export class AccountRepository implements IAccountRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<AccountEntity | null> {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });

        if (!account) return null;

        return AccountEntity.create({
            id: account.id,
            name: account.name,
            ownerId: account.ownerId,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        });
    }

    async findByOwnerId(ownerId: string): Promise<AccountEntity[]> {
        const accounts = await this.prisma.account.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
        });

        return accounts.map((a) =>
            AccountEntity.create({
                id: a.id,
                name: a.name,
                ownerId: a.ownerId,
                isActive: a.isActive,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
            }),
        );
    }

    async create(data: CreateAccountData): Promise<AccountEntity> {
        const account = await this.prisma.account.create({
            data: {
                name: data.name,
                ownerId: data.ownerId,
                isActive: data.isActive ?? true,
            },
        });

        return AccountEntity.create({
            id: account.id,
            name: account.name,
            ownerId: account.ownerId,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        });
    }

    async update(id: string, data: UpdateAccountData): Promise<AccountEntity> {
        const account = await this.prisma.account.update({
            where: { id },
            data: {
                name: data.name,
                isActive: data.isActive,
            },
        });

        return AccountEntity.create({
            id: account.id,
            name: account.name,
            ownerId: account.ownerId,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.account.delete({
            where: { id },
        });
    }
}
