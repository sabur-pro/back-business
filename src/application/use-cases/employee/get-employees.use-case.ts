import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { EmployeeResponseDto } from '@/application/dto/employee';

@Injectable()
export class GetEmployeesUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(organizerId: string): Promise<EmployeeResponseDto[]> {
        // Get organizer's account
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            return [];
        }
        const accountId = accounts[0].id;

        // Get employees by account ID
        const employees = await this.userRepository.findByAccountId(accountId);

        return employees.map(employee => ({
            id: employee.id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fullName: employee.fullName,
            phone: employee.phone || undefined,
            role: employee.role,
            canCreateShipment: employee.canCreateShipment,
            canReceiveShipment: employee.canReceiveShipment,
            isActive: employee.isActive,
            createdAt: employee.createdAt,
        }));
    }
}
