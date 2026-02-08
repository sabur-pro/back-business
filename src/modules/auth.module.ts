import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Controllers
import { AuthController } from '@/presentation/controllers/auth.controller';

// Strategies & Guards
import { JwtStrategy } from '@/presentation/strategies/jwt.strategy';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/presentation/guards/roles.guard';

// Use Cases
import {
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GetMeUseCase,
} from '@/application/use-cases/auth';

// Repositories
import { UserRepository } from '@/infrastructure/database/repositories/user.repository';
import { RefreshTokenRepository } from '@/infrastructure/database/repositories/refresh-token.repository';
import { AccountRepository } from '@/infrastructure/database/repositories/account.repository';
import { USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { REFRESH_TOKEN_REPOSITORY } from '@/domain/repositories/refresh-token.repository.interface';
import { ACCOUNT_REPOSITORY } from '@/domain/repositories/account.repository.interface';

// Services
import { HashService, HASH_SERVICE } from '@/infrastructure/services/hash.service';
import { JwtTokenService, JWT_TOKEN_SERVICE } from '@/infrastructure/services/jwt-token.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        // Strategies
        JwtStrategy,

        // Global Guards
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },

        // Repositories
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: REFRESH_TOKEN_REPOSITORY,
            useClass: RefreshTokenRepository,
        },
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: AccountRepository,
        },

        // Services
        {
            provide: HASH_SERVICE,
            useClass: HashService,
        },
        {
            provide: JWT_TOKEN_SERVICE,
            useClass: JwtTokenService,
        },

        // Use Cases
        RegisterUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        GetMeUseCase,
    ],
    exports: [USER_REPOSITORY, ACCOUNT_REPOSITORY],
})
export class AuthModule { }
