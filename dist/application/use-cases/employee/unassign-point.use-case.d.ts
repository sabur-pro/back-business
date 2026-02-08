import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { IPointRepository } from '@/domain/repositories/point.repository.interface';
import { IPointMemberRepository } from '@/domain/repositories/point-member.repository.interface';
export declare class UnassignPointUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    private readonly pointRepository;
    private readonly pointMemberRepository;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository, pointRepository: IPointRepository, pointMemberRepository: IPointMemberRepository);
    execute(organizerId: string, employeeId: string, pointId: string): Promise<void>;
}
