import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { EmployeeResponseDto } from '@/application/dto/employee';
export declare class GetEmployeesUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository);
    execute(organizerId: string): Promise<EmployeeResponseDto[]>;
}
