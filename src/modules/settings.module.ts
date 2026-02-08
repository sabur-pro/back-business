import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { SettingsController } from '@presentation/controllers';
import {
    UserRepository,
    AccountRepository,
    OrgSettingsRepository,
} from '@infrastructure/database/repositories';
import {
    USER_REPOSITORY,
    ACCOUNT_REPOSITORY,
    ORG_SETTINGS_REPOSITORY,
} from '@domain/repositories';
import {
    GetOrgSettingsUseCase,
    UpdateOrgSettingsUseCase,
} from '@application/use-cases/settings';

@Module({
    imports: [PrismaModule],
    controllers: [SettingsController],
    providers: [
        { provide: USER_REPOSITORY, useClass: UserRepository },
        { provide: ACCOUNT_REPOSITORY, useClass: AccountRepository },
        { provide: ORG_SETTINGS_REPOSITORY, useClass: OrgSettingsRepository },

        GetOrgSettingsUseCase,
        UpdateOrgSettingsUseCase,
    ],
})
export class SettingsModule { }
