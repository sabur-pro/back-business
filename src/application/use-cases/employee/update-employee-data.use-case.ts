import { Inject, Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { IHashService, HASH_SERVICE } from '@infrastructure/services/hash.service';
import { UpdateEmployeeDataDto, EmployeeResponseDto } from '@/application/dto/employee';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class UpdateEmployeeDataUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(HASH_SERVICE)
        private readonly hashService: IHashService,
    ) { }

    async execute(currentUserId: string, employeeId: string, dto: UpdateEmployeeDataDto): Promise<EmployeeResponseDto> {
        const currentUser = await this.userRepository.findById(currentUserId);
        if (!currentUser) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Allow: organizer editing any employee in their org, or user editing themselves
        const isSelf = currentUserId === employeeId;

        if (!isSelf) {
            // Only organizer can edit others
            if (currentUser.role !== UserRole.ORGANIZER) {
                throw new ForbiddenException('Только организатор может изменять данные сотрудников');
            }

            // Verify employee belongs to organizer's account
            const accounts = await this.accountRepository.findByOwnerId(currentUserId);
            if (accounts.length === 0) {
                throw new ForbiddenException('У вас нет организации');
            }
            const accountId = accounts[0].id;

            const employee = await this.userRepository.findById(employeeId);
            if (!employee) {
                throw new NotFoundException('Сотрудник не найден');
            }
            if (employee.accountId !== accountId) {
                throw new ForbiddenException('Сотрудник не принадлежит вашей организации');
            }
        }

        // If changing email, check uniqueness
        if (dto.email) {
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser && existingUser.id !== employeeId) {
                throw new BadRequestException('Пользователь с таким email уже существует');
            }
        }

        // Build update data
        const updateData: Record<string, any> = {};
        if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
        if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
        if (dto.email !== undefined) updateData.email = dto.email;
        if (dto.phone !== undefined) updateData.phone = dto.phone;
        if (dto.password) {
            updateData.password = await this.hashService.hash(dto.password);
        }

        const updated = await this.userRepository.update(employeeId, updateData);

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
