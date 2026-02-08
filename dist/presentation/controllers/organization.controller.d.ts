import { CreateAccountDto, CreatePointDto, AccountResponseDto, PointResponseDto } from '@application/dto/organization';
import { CreateAccountUseCase, GetAccountsUseCase, CreatePointUseCase, GetPointsUseCase, UpdatePointUseCase } from '@application/use-cases/organization';
export declare class OrganizationController {
    private readonly createAccountUseCase;
    private readonly getAccountsUseCase;
    private readonly createPointUseCase;
    private readonly getPointsUseCase;
    private readonly updatePointUseCase;
    constructor(createAccountUseCase: CreateAccountUseCase, getAccountsUseCase: GetAccountsUseCase, createPointUseCase: CreatePointUseCase, getPointsUseCase: GetPointsUseCase, updatePointUseCase: UpdatePointUseCase);
    createAccount(userId: string, dto: CreateAccountDto): Promise<AccountResponseDto>;
    getAccounts(userId: string): Promise<AccountResponseDto[]>;
    createPoint(userId: string, accountId: string, dto: CreatePointDto): Promise<PointResponseDto>;
    getPoints(userId: string): Promise<PointResponseDto[]>;
    getPointsByAccount(accountId: string): Promise<PointResponseDto[]>;
    updatePoint(userId: string, pointId: string, dto: CreatePointDto): Promise<PointResponseDto>;
}
