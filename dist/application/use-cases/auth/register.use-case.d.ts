import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '@/domain/repositories/refresh-token.repository.interface';
import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { IHashService } from '@/infrastructure/services/hash.service';
import { IJwtTokenService } from '@/infrastructure/services/jwt-token.service';
import { RegisterDto, AuthResponseDto } from '@/application/dto/auth';
export declare class RegisterUseCase {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly accountRepository;
    private readonly hashService;
    private readonly jwtTokenService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, accountRepository: IAccountRepository, hashService: IHashService, jwtTokenService: IJwtTokenService);
    execute(dto: RegisterDto): Promise<AuthResponseDto>;
}
