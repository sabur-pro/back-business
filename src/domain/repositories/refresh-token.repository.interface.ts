import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export interface CreateRefreshTokenData {
    token: string;
    userId: string;
    expiresAt: Date;
}

/**
 * RefreshToken Repository Interface
 */
export interface IRefreshTokenRepository {
    findByToken(token: string): Promise<RefreshTokenEntity | null>;
    findByUserId(userId: string): Promise<RefreshTokenEntity[]>;
    create(data: CreateRefreshTokenData): Promise<RefreshTokenEntity>;
    deleteByToken(token: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    deleteExpired(): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('IRefreshTokenRepository');
