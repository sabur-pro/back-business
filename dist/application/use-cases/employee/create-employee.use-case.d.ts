import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { IHashService } from '@/infrastructure/services/hash.service';
import { CreateEmployeeDto, EmployeeResponseDto } from '@/application/dto/employee';
export declare class CreateEmployeeUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    private readonly hashService;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository, hashService: IHashService);
    execute(organizerId: string, dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
}
