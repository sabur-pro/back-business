import { IAccountRepository } from '@domain/repositories/account.repository.interface';
import { IOrgSettingsRepository } from '@domain/repositories/org-settings.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { UpdateOrgSettingsDto, OrgSettingsResponseDto } from '@application/dto/settings';
export declare class GetOrgSettingsUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    private readonly orgSettingsRepository;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository, orgSettingsRepository: IOrgSettingsRepository);
    execute(userId: string): Promise<OrgSettingsResponseDto>;
}
export declare class UpdateOrgSettingsUseCase {
    private readonly userRepository;
    private readonly accountRepository;
    private readonly orgSettingsRepository;
    constructor(userRepository: IUserRepository, accountRepository: IAccountRepository, orgSettingsRepository: IOrgSettingsRepository);
    execute(userId: string, dto: UpdateOrgSettingsDto): Promise<OrgSettingsResponseDto>;
}
