import { Inject, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { HASH_SERVICE, IHashService } from '@/infrastructure/services/hash.service';
import { CreateEmployeeDto, EmployeeResponseDto } from '@/application/dto/employee';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class CreateEmployeeUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(HASH_SERVICE)
        private readonly hashService: IHashService,
    ) { }

    async execute(organizerId: string, dto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
        // 1. Verify organizer
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== UserRole.ORGANIZER) {
            throw new ForbiddenException('Только организатор может создавать сотрудников');
        }

        // 2. Get organizer's account
        // Assuming 1-to-1 relationship for now or getting the first owned account
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            throw new BadRequestException('У вас нет организации');
        }
        const accountId = accounts[0].id;

        // 3. Check if user already exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new BadRequestException('Пользователь с таким email уже существует');
        }

        // 4. Hash password
        const hashedPassword = await this.hashService.hash(dto.password);

        // 5. Create employee
        const employee = await this.userRepository.create({
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            role: UserRole.POINT_ADMIN,
            accountId: accountId,
            isActive: true,
        });

        return {
            id: employee.id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fullName: employee.fullName,
            phone: employee.phone || undefined,
            role: employee.role,
            canCreateShipment: employee.canCreateShipment,
            canReceiveShipment: employee.canReceiveShipment,
            canSell: employee.canSell,
            canAddProducts: employee.canAddProducts,
            canManageCounterparties: employee.canManageCounterparties,
            isActive: employee.isActive,
            createdAt: employee.createdAt,
        };
    }
}
