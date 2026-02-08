import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { WarehouseController } from '@presentation/controllers';
import {
    WarehouseRepository,
    PointRepository,
} from '@infrastructure/database/repositories';
import {
    WAREHOUSE_REPOSITORY,
    POINT_REPOSITORY,
} from '@domain/repositories';
import {
    CreateWarehouseUseCase,
    GetWarehousesUseCase,
    UpdateWarehouseUseCase,
    DeleteWarehouseUseCase,
} from '@application/use-cases/warehouse';

@Module({
    imports: [PrismaModule],
    controllers: [WarehouseController],
    providers: [
        // Repositories
        {
            provide: WAREHOUSE_REPOSITORY,
            useClass: WarehouseRepository,
        },
        {
            provide: POINT_REPOSITORY,
            useClass: PointRepository,
        },
        // Use Cases
        CreateWarehouseUseCase,
        GetWarehousesUseCase,
        UpdateWarehouseUseCase,
        DeleteWarehouseUseCase,
    ],
    exports: [WAREHOUSE_REPOSITORY, POINT_REPOSITORY],
})
export class WarehouseModule { }
