import { PrismaService } from '../prisma/prisma.service';
import { IRefreshTokenRepository, CreateRefreshTokenData } from '@/domain/repositories/refresh-token.repository.interface';
import { RefreshTokenEntity } from '@/domain/entities/refresh-token.entity';
export declare class RefreshTokenRepository implements IRefreshTokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByToken(token: string): Promise<RefreshTokenEntity | null>;
    findByUserId(userId: string): Promise<RefreshTokenEntity[]>;
    create(data: CreateRefreshTokenData): Promise<RefreshTokenEntity>;
    deleteByToken(token: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    deleteExpired(): Promise<void>;
}
