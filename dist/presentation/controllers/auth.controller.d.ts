import { RegisterUseCase, LoginUseCase, RefreshTokenUseCase, LogoutUseCase, GetMeUseCase } from '@/application/use-cases/auth';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto, TokenResponseDto, UserResponseDto } from '@/application/dto/auth';
import { CurrentUserData } from '../decorators/current-user.decorator';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly refreshTokenUseCase;
    private readonly logoutUseCase;
    private readonly getMeUseCase;
    constructor(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase, refreshTokenUseCase: RefreshTokenUseCase, logoutUseCase: LogoutUseCase, getMeUseCase: GetMeUseCase);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(dto: RefreshTokenDto): Promise<TokenResponseDto>;
    logout(dto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    logoutAll(user: CurrentUserData): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<UserResponseDto>;
}
