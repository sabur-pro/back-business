import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '@/domain/repositories/refresh-token.repository.interface';
import { IJwtTokenService } from '@/infrastructure/services/jwt-token.service';
import { TokenResponseDto } from '@/application/dto/auth';
export declare class RefreshTokenUseCase {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtTokenService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, jwtTokenService: IJwtTokenService);
    execute(refreshToken: string): Promise<TokenResponseDto>;
}
