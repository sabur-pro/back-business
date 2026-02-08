import { Inject, Injectable } from '@nestjs/common';
import {
    IRefreshTokenRepository,
    REFRESH_TOKEN_REPOSITORY,
} from '@/domain/repositories/refresh-token.repository.interface';

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject(REFRESH_TOKEN_REPOSITORY)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) { }

    async execute(refreshToken: string): Promise<void> {
        await this.refreshTokenRepository.deleteByToken(refreshToken);
    }

    async executeAll(userId: string): Promise<void> {
        await this.refreshTokenRepository.deleteByUserId(userId);
    }
}
