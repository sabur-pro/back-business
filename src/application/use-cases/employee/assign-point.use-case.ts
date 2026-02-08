import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { IPointMemberRepository, POINT_MEMBER_REPOSITORY } from '@/domain/repositories/point-member.repository.interface';
import { IPointRepository, POINT_REPOSITORY } from '@/domain/repositories/point.repository.interface';
import { PointAssignmentResponseDto } from '@/application/dto/employee';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class AssignPointUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(POINT_MEMBER_REPOSITORY)
        private readonly pointMemberRepository: IPointMemberRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async execute(organizerId: string, employeeId: string, pointId: string): Promise<PointAssignmentResponseDto> {
        // 1. Verify organizer
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== UserRole.ORGANIZER) {
            throw new ForbiddenException('Только организатор может назначать сотрудников на точки');
        }

        // 2. Get organizer's account
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            throw new ForbiddenException('У вас нет организации');
        }
        const accountId = accounts[0].id;

        // 3. Verify point exists and belongs to the organizer's account
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }
        if (point.accountId !== accountId) {
            throw new ForbiddenException('Точка не принадлежит вашей организации');
        }

        // 4. Verify employee exists and belongs to the same account
        const employee = await this.userRepository.findById(employeeId);
        if (!employee) {
            throw new NotFoundException('Сотрудник не найден');
        }
        if (employee.accountId !== accountId) {
            throw new ForbiddenException('Сотрудник не принадлежит вашей организации');
        }

        // 5. Create assignment
        const existingAssignment = await this.pointMemberRepository.findByPointAndUser(pointId, employeeId);
        if (existingAssignment) {
            return {
                id: existingAssignment.id,
                pointId: existingAssignment.pointId,
                pointName: existingAssignment.pointName || point.name,
                userId: existingAssignment.userId,
                role: existingAssignment.role,
                createdAt: existingAssignment.createdAt,
            };
        }

        const assignment = await this.pointMemberRepository.create({
            pointId,
            userId: employeeId,
            role: UserRole.POINT_ADMIN,
        });

        return {
            id: assignment.id,
            pointId: assignment.pointId,
            pointName: assignment.pointName || point.name,
            userId: assignment.userId,
            role: assignment.role,
            createdAt: assignment.createdAt,
        };
    }
}
