import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { CounterpartyController } from '@presentation/controllers/counterparty.controller';
import {
    CounterpartyRepository,
    CashRegisterRepository,
    UserRepository,
    PointRepository,
} from '@infrastructure/database/repositories';
import {
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    CreateCounterpartyUseCase,
    GetCounterpartiesUseCase,
    UpdateCounterpartyUseCase,
    PayCounterpartyDebtUseCase,
} from '@application/use-cases/counterparty';

@Module({
    imports: [PrismaModule],
    controllers: [CounterpartyController],
    providers: [
        // Repositories
        {
            provide: COUNTERPARTY_REPOSITORY,
            useClass: CounterpartyRepository,
        },
        {
            provide: CASH_REGISTER_REPOSITORY,
            useClass: CashRegisterRepository,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: POINT_REPOSITORY,
            useClass: PointRepository,
        },
        // Use Cases
        CreateCounterpartyUseCase,
        GetCounterpartiesUseCase,
        UpdateCounterpartyUseCase,
        PayCounterpartyDebtUseCase,
    ],
    exports: [COUNTERPARTY_REPOSITORY],
})
export class CounterpartyModule { }
