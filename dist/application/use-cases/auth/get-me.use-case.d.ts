import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { UserResponseDto } from '@/application/dto/auth';
export declare class GetMeUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(userId: string): Promise<UserResponseDto>;
}
