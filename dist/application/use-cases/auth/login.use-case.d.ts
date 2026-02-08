import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '@/domain/repositories/refresh-token.repository.interface';
import { IHashService } from '@/infrastructure/services/hash.service';
import { IJwtTokenService } from '@/infrastructure/services/jwt-token.service';
import { LoginDto, AuthResponseDto } from '@/application/dto/auth';
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly hashService;
    private readonly jwtTokenService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, hashService: IHashService, jwtTokenService: IJwtTokenService);
    execute(dto: LoginDto): Promise<AuthResponseDto>;
}
