import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IAccountRepository, ACCOUNT_REPOSITORY } from '@domain/repositories/account.repository.interface';
import { IOrgSettingsRepository, ORG_SETTINGS_REPOSITORY } from '@domain/repositories/org-settings.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { UserRole } from '@domain/entities/user.entity';
import { UpdateOrgSettingsDto, OrgSettingsResponseDto } from '@application/dto/settings';

@Injectable()
export class GetOrgSettingsUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(ORG_SETTINGS_REPOSITORY)
        private readonly orgSettingsRepository: IOrgSettingsRepository,
    ) { }

    async execute(userId: string): Promise<OrgSettingsResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new ForbiddenException('Пользователь не найден');

        let accountId: string | undefined;

        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(userId);
            if (accounts.length > 0) {
                accountId = accounts[0].id;
            } else if (user.accountId) {
                accountId = user.accountId;
            }
        } else {
            accountId = user.accountId || undefined;
        }

        if (!accountId) {
            // Return defaults if no account found
            return {
                id: '',
                accountId: '',
                canAddEmployees: true,
                canAddPoints: true,
                canAddWarehouses: true,
                canAddProducts: false,
                hardDeleteProducts: false,
            };
        }

        const settings = await this.orgSettingsRepository.findByAccountId(accountId);
        if (!settings) {
            return {
                id: '',
                accountId,
                canAddEmployees: true,
                canAddPoints: true,
                canAddWarehouses: true,
                canAddProducts: false,
                hardDeleteProducts: false,
            };
        }

        return {
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
            hardDeleteProducts: settings.hardDeleteProducts,
        };
    }
}

@Injectable()
export class UpdateOrgSettingsUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(ORG_SETTINGS_REPOSITORY)
        private readonly orgSettingsRepository: IOrgSettingsRepository,
    ) { }

    async execute(userId: string, dto: UpdateOrgSettingsDto): Promise<OrgSettingsResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user || (user.role !== UserRole.ORGANIZER && user.role !== UserRole.DEVELOPER)) {
            throw new ForbiddenException('Только организатор может изменять настройки');
        }

        let accountId: string | undefined;
        const accounts = await this.accountRepository.findByOwnerId(userId);
        if (accounts.length > 0) {
            accountId = accounts[0].id;
        } else if (user.accountId) {
            accountId = user.accountId;
        }

        if (!accountId) {
            throw new ForbiddenException('У вас нет организации');
        }

        const settings = await this.orgSettingsRepository.upsert(accountId, {
            canAddEmployees: dto.canAddEmployees,
            canAddPoints: dto.canAddPoints,
            canAddWarehouses: dto.canAddWarehouses,
            canAddProducts: dto.canAddProducts,
            hardDeleteProducts: dto.hardDeleteProducts,
        });

        return {
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
            hardDeleteProducts: settings.hardDeleteProducts,
        };
    }
}
