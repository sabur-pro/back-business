import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { SaleController } from '@presentation/controllers/sale.controller';
import {
    SaleRepository,
    ProductRepository,
    WarehouseRepository,
    PointRepository,
    UserRepository,
    CounterpartyRepository,
    CashRegisterRepository,
} from '@infrastructure/database/repositories';
import {
    SALE_REPOSITORY,
} from '@domain/repositories/sale.repository.interface';
import {
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
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
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    CreateSaleUseCase,
    GetSalesUseCase,
    CancelSaleUseCase,
} from '@application/use-cases/sale';

@Module({
    imports: [PrismaModule],
    controllers: [SaleController],
    providers: [
        // Repositories
        {
            provide: SALE_REPOSITORY,
            useClass: SaleRepository,
        },
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductRepository,
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
        {
            provide: COUNTERPARTY_REPOSITORY,
            useClass: CounterpartyRepository,
        },
        {
            provide: CASH_REGISTER_REPOSITORY,
            useClass: CashRegisterRepository,
        },
        // Use Cases
        CreateSaleUseCase,
        GetSalesUseCase,
        CancelSaleUseCase,
    ],
})
export class SaleModule { }
