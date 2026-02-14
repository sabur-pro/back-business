import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { IPointRepository, POINT_REPOSITORY } from '@/domain/repositories/point.repository.interface';
import { IPointMemberRepository, POINT_MEMBER_REPOSITORY } from '@/domain/repositories/point-member.repository.interface';
import { EmployeeResponseDto } from '@/application/dto/employee';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class GetPointEmployeesUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(POINT_MEMBER_REPOSITORY)
        private readonly pointMemberRepository: IPointMemberRepository,
    ) { }

    async execute(organizerId: string, pointId: string): Promise<EmployeeResponseDto[]> {
        // Verify organizer
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== UserRole.ORGANIZER) {
            throw new ForbiddenException('Только организатор может просматривать сотрудников точки');
        }

        // Verify point exists
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        // Get members assigned to this point
        const members = await this.pointMemberRepository.findByPointId(pointId);

        // Load full user info for each member
        const employees: EmployeeResponseDto[] = [];
        for (const member of members) {
            const user = await this.userRepository.findById(member.userId);
            if (user) {
                employees.push({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    phone: user.phone || undefined,
                    role: user.role,
                    canCreateShipment: user.canCreateShipment,
                    canReceiveShipment: user.canReceiveShipment,
                    canSell: user.canSell,
                    canAddProducts: user.canAddProducts,
                    canManageCounterparties: user.canManageCounterparties,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                });
            }
        }

        return employees;
    }
}
