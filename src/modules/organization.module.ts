import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { OrganizationController } from '@presentation/controllers';
import {
    AccountRepository,
    PointRepository,
} from '@infrastructure/database/repositories';
import {
    ACCOUNT_REPOSITORY,
    POINT_REPOSITORY,
} from '@domain/repositories';
import {
    CreateAccountUseCase,
    GetAccountsUseCase,
    CreatePointUseCase,
    GetPointsUseCase,
    UpdatePointUseCase,
} from '@application/use-cases/organization';

@Module({
    imports: [PrismaModule],
    controllers: [OrganizationController],
    providers: [
        // Repositories
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: AccountRepository,
        },
        {
            provide: POINT_REPOSITORY,
            useClass: PointRepository,
        },
        // Use Cases
        CreateAccountUseCase,
        GetAccountsUseCase,
        CreatePointUseCase,
        GetPointsUseCase,
        UpdatePointUseCase,
    ],
    exports: [ACCOUNT_REPOSITORY, POINT_REPOSITORY],
})
export class OrganizationModule { }
