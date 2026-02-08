import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository } from '@domain/repositories/account.repository.interface';
export declare class DeleteEmployeeUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository);
    execute(organizerId: string, employeeId: string): Promise<void>;
}
