import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import {
    IRefreshTokenRepository,
    REFRESH_TOKEN_REPOSITORY,
} from '@/domain/repositories/refresh-token.repository.interface';
import { IHashService, HASH_SERVICE } from '@/infrastructure/services/hash.service';
import {
    IJwtTokenService,
    JWT_TOKEN_SERVICE,
} from '@/infrastructure/services/jwt-token.service';
import { LoginDto, AuthResponseDto, UserResponseDto } from '@/application/dto/auth';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(REFRESH_TOKEN_REPOSITORY)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        @Inject(HASH_SERVICE)
        private readonly hashService: IHashService,
        @Inject(JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: IJwtTokenService,
    ) { }

    async execute(dto: LoginDto): Promise<AuthResponseDto> {
        // Find user by email
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedException('Аккаунт деактивирован');
        }

        // Verify password
        const isPasswordValid = await this.hashService.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Generate tokens
        const tokenPair = await this.jwtTokenService.generateTokenPair(user.id, user.email, user.role);

        // Save refresh token
        await this.refreshTokenRepository.create({
            token: tokenPair.refreshToken,
            userId: user.id,
            expiresAt: this.jwtTokenService.getRefreshTokenExpirationDate(),
        });

        // Build response
        const userResponse: UserResponseDto = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            phone: user.phone || undefined,
            role: user.role,
            accountId: user.accountId || undefined,
        };

        return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: userResponse,
        };
    }
}
