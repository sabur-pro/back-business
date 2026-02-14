import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import {
    IRefreshTokenRepository,
    REFRESH_TOKEN_REPOSITORY,
} from '@/domain/repositories/refresh-token.repository.interface';
import {
    IAccountRepository,
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import { IHashService, HASH_SERVICE } from '@/infrastructure/services/hash.service';
import {
    IJwtTokenService,
    JWT_TOKEN_SERVICE,
} from '@/infrastructure/services/jwt-token.service';
import { RegisterDto, AuthResponseDto, UserResponseDto } from '@/application/dto/auth';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(REFRESH_TOKEN_REPOSITORY)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(HASH_SERVICE)
        private readonly hashService: IHashService,
        @Inject(JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: IJwtTokenService,
    ) { }

    async execute(dto: RegisterDto): Promise<AuthResponseDto> {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        // Hash password
        const hashedPassword = await this.hashService.hash(dto.password);

        // Create user with ORGANIZER role
        const user = await this.userRepository.create({
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone || null,
            role: UserRole.ORGANIZER,
            isActive: true,
        });

        // Auto-create organization for the new user
        const account = await this.accountRepository.create({
            name: `Организация ${user.firstName}`,
            ownerId: user.id,
        });

        // Link user to the new account
        await this.userRepository.update(user.id, { accountId: account.id });

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
            accountId: account.id,
            canAddProducts: user.canAddProducts,
            canManageCounterparties: user.canManageCounterparties,
        };

        return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: userResponse,
        };
    }
}
