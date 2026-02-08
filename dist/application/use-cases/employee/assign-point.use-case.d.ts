import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { IPointMemberRepository } from '@/domain/repositories/point-member.repository.interface';
import { IPointRepository } from '@/domain/repositories/point.repository.interface';
import { PointAssignmentResponseDto } from '@/application/dto/employee';
export declare class AssignPointUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    private readonly pointMemberRepository;
    private readonly pointRepository;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository, pointMemberRepository: IPointMemberRepository, pointRepository: IPointRepository);
    execute(organizerId: string, employeeId: string, pointId: string): Promise<PointAssignmentResponseDto>;
}
