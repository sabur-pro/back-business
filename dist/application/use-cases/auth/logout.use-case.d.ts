import { IRefreshTokenRepository } from '@/domain/repositories/refresh-token.repository.interface';
export declare class LogoutUseCase {
    private readonly refreshTokenRepository;
    constructor(refreshTokenRepository: IRefreshTokenRepository);
    execute(refreshToken: string): Promise<void>;
    executeAll(userId: string): Promise<void>;
}
