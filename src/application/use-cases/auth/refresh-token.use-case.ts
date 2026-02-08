import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import {
    IRefreshTokenRepository,
    REFRESH_TOKEN_REPOSITORY,
} from '@/domain/repositories/refresh-token.repository.interface';
import {
    IJwtTokenService,
    JWT_TOKEN_SERVICE,
} from '@/infrastructure/services/jwt-token.service';
import { TokenResponseDto } from '@/application/dto/auth';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(REFRESH_TOKEN_REPOSITORY)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        @Inject(JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: IJwtTokenService,
    ) { }

    async execute(refreshToken: string): Promise<TokenResponseDto> {
        // Find refresh token
        const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw new UnauthorizedException('Недействительный refresh token');
        }

        // Check if token is expired
        if (storedToken.isExpired()) {
            await this.refreshTokenRepository.deleteByToken(refreshToken);
            throw new UnauthorizedException('Refresh token истёк');
        }

        // Find user
        const user = await this.userRepository.findById(storedToken.userId);
        if (!user || !user.isActive) {
            await this.refreshTokenRepository.deleteByToken(refreshToken);
            throw new UnauthorizedException('Пользователь не найден или деактивирован');
        }

        // Delete old refresh token
        await this.refreshTokenRepository.deleteByToken(refreshToken);

        // Generate new tokens
        const tokenPair = await this.jwtTokenService.generateTokenPair(user.id, user.email, user.role);

        // Save new refresh token
        await this.refreshTokenRepository.create({
            token: tokenPair.refreshToken,
            userId: user.id,
            expiresAt: this.jwtTokenService.getRefreshTokenExpirationDate(),
        });

        return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
        };
    }
}
