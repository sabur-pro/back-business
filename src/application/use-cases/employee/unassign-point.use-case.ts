import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { IPointRepository, POINT_REPOSITORY } from '@/domain/repositories/point.repository.interface';
import { IPointMemberRepository, POINT_MEMBER_REPOSITORY } from '@/domain/repositories/point-member.repository.interface';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class UnassignPointUseCase {
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

    async execute(organizerId: string, employeeId: string, pointId: string): Promise<void> {
        // 1. Verify organizer
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== UserRole.ORGANIZER) {
            throw new ForbiddenException('Только организатор может снимать назначения');
        }

        // 2. Verify point exists
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        // 3. Verify assignment exists
        const assignment = await this.pointMemberRepository.findByPointAndUser(pointId, employeeId);
        if (!assignment) {
            throw new NotFoundException('Назначение не найдено');
        }

        // 4. Delete assignment
        await this.pointMemberRepository.deleteByPointAndUser(pointId, employeeId);
    }
}
