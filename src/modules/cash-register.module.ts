import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { CashRegisterController } from '@presentation/controllers/cash-register.controller';
import {
    CashRegisterRepository,
    CounterpartyRepository,
    WarehouseRepository,
    PointRepository,
    UserRepository,
} from '@infrastructure/database/repositories';
import {
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    GetCashRegisterUseCase,
    PayFromCashRegisterUseCase,
    TransferToSafeUseCase,
    CreateExpenseUseCase,
    PayoutUseCase,
} from '@application/use-cases/cash-register';

@Module({
    imports: [PrismaModule],
    controllers: [CashRegisterController],
    providers: [
        // Repositories
        {
            provide: CASH_REGISTER_REPOSITORY,
            useClass: CashRegisterRepository,
        },
        {
            provide: COUNTERPARTY_REPOSITORY,
            useClass: CounterpartyRepository,
        },
        {
            provide: WAREHOUSE_REPOSITORY,
            useClass: WarehouseRepository,
        },
        {
            provide: POINT_REPOSITORY,
            useClass: PointRepository,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        // Use Cases
        GetCashRegisterUseCase,
        PayFromCashRegisterUseCase,
        TransferToSafeUseCase,
        CreateExpenseUseCase,
        PayoutUseCase,
    ],
    exports: [CASH_REGISTER_REPOSITORY],
})
export class CashRegisterModule { }
