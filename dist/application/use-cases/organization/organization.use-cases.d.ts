import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { IPointRepository } from '@domain/repositories/point.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { AccountEntity } from '@domain/entities/account.entity';
import { PointEntity } from '@domain/entities/point.entity';
import { CreateAccountDto, CreatePointDto } from '@application/dto/organization';
export declare class CreateAccountUseCase {
    private readonly accountRepository;
    constructor(accountRepository: IAccountRepository);
    execute(userId: string, dto: CreateAccountDto): Promise<AccountEntity>;
}
export declare class GetAccountsUseCase {
    private readonly accountRepository;
    private readonly userRepository;
    constructor(accountRepository: IAccountRepository, userRepository: IUserRepository);
    execute(userId: string): Promise<AccountEntity[]>;
}
export declare class GetAllAccountsUseCase {
    private readonly accountRepository;
    constructor(accountRepository: IAccountRepository);
    execute(): Promise<AccountEntity[]>;
}
export declare class CreatePointUseCase {
    private readonly pointRepository;
    private readonly accountRepository;
    constructor(pointRepository: IPointRepository, accountRepository: IAccountRepository);
    execute(userId: string, accountId: string, dto: CreatePointDto): Promise<PointEntity>;
}
export declare class UpdatePointUseCase {
    private readonly pointRepository;
    private readonly accountRepository;
    constructor(pointRepository: IPointRepository, accountRepository: IAccountRepository);
    execute(userId: string, pointId: string, dto: CreatePointDto): Promise<PointEntity>;
}
export declare class GetPointsUseCase {
    private readonly pointRepository;
    constructor(pointRepository: IPointRepository);
    execute(userId: string): Promise<PointEntity[]>;
    executeByAccountId(accountId: string): Promise<PointEntity[]>;
}
