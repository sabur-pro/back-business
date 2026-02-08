import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRefreshTokenRepository, CreateRefreshTokenData } from '@/domain/repositories/refresh-token.repository.interface';
import { RefreshTokenEntity } from '@/domain/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByToken(token: string): Promise<RefreshTokenEntity | null> {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token },
        });

        if (!refreshToken) return null;

        return RefreshTokenEntity.create(refreshToken);
    }

    async findByUserId(userId: string): Promise<RefreshTokenEntity[]> {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { userId },
        });

        return tokens.map((token) => RefreshTokenEntity.create(token));
    }

    async create(data: CreateRefreshTokenData): Promise<RefreshTokenEntity> {
        const refreshToken = await this.prisma.refreshToken.create({
            data: {
                token: data.token,
                userId: data.userId,
                expiresAt: data.expiresAt,
            },
        });

        return RefreshTokenEntity.create(refreshToken);
    }

    async deleteByToken(token: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { token },
        });
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }

    async deleteExpired(): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}
