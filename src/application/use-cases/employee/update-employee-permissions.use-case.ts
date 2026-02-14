import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { UpdateEmployeePermissionsDto, EmployeeResponseDto } from '@/application/dto/employee';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class UpdateEmployeePermissionsUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(organizerId: string, employeeId: string, dto: UpdateEmployeePermissionsDto): Promise<EmployeeResponseDto> {
        // 1. Verify organizer
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== UserRole.ORGANIZER) {
            throw new ForbiddenException('Только организатор может изменять разрешения');
        }

        // 2. Get organizer's account
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            throw new ForbiddenException('У вас нет организации');
        }
        const accountId = accounts[0].id;

        // 3. Verify employee exists and belongs to the same account
        const employee = await this.userRepository.findById(employeeId);
        if (!employee) {
            throw new NotFoundException('Сотрудник не найден');
        }
        if (employee.accountId !== accountId) {
            throw new ForbiddenException('Сотрудник не принадлежит вашей организации');
        }

        // 4. Update permissions
        const updated = await this.userRepository.update(employeeId, {
            canCreateShipment: dto.canCreateShipment,
            canReceiveShipment: dto.canReceiveShipment,
            canSell: dto.canSell,
            canAddProducts: dto.canAddProducts,
            canManageCounterparties: dto.canManageCounterparties,
        });

        return {
            id: updated.id,
            email: updated.email,
            firstName: updated.firstName,
            lastName: updated.lastName,
            fullName: updated.fullName,
            phone: updated.phone || undefined,
            role: updated.role,
            canCreateShipment: updated.canCreateShipment,
            canReceiveShipment: updated.canReceiveShipment,
            canSell: updated.canSell,
            canAddProducts: updated.canAddProducts,
            canManageCounterparties: updated.canManageCounterparties,
            isActive: updated.isActive,
            createdAt: updated.createdAt,
        };
    }
}
