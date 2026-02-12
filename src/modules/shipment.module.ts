import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { ShipmentController } from '@presentation/controllers/shipment.controller';
import {
    ShipmentRepository,
    ProductRepository,
    PointRepository,
    WarehouseRepository,
    UserRepository,
    AccountRepository,
} from '@infrastructure/database/repositories';
import {
    SHIPMENT_REPOSITORY,
} from '@domain/repositories/shipment.repository.interface';
import {
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
import {
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import {
    CreateShipmentUseCase,
    AcceptShipmentUseCase,
    CancelShipmentUseCase,
    GetShipmentsUseCase,
} from '@application/use-cases/shipment';

@Module({
    imports: [PrismaModule],
    controllers: [ShipmentController],
    providers: [
        // Repositories
        {
            provide: SHIPMENT_REPOSITORY,
            useClass: ShipmentRepository,
        },
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductRepository,
        },
        {
            provide: POINT_REPOSITORY,
            useClass: PointRepository,
        },
        {
            provide: WAREHOUSE_REPOSITORY,
            useClass: WarehouseRepository,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: AccountRepository,
        },
        // Use Cases
        CreateShipmentUseCase,
        AcceptShipmentUseCase,
        CancelShipmentUseCase,
        GetShipmentsUseCase,
    ],
})
export class ShipmentModule { }
