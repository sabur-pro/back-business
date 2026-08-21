import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { ShopController } from '@presentation/controllers/shop.controller';
import {
    WarehouseRepository,
    PointRepository,
    UserRepository,
    ShopEmployeeRepository,
    ProductArrivalRepository,
} from '@infrastructure/database/repositories';
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
    SHOP_EMPLOYEE_REPOSITORY,
} from '@domain/repositories/shop-employee.repository.interface';
import {
    PRODUCT_ARRIVAL_REPOSITORY,
} from '@domain/repositories/product-arrival.repository.interface';
import {
    AddShopEmployeeUseCase,
    RemoveShopEmployeeUseCase,
    GetShopEmployeesUseCase,
    GetShopArrivalsUseCase,
    CreateShopReturnUseCase,
} from '@application/use-cases/shop';

@Module({
    imports: [PrismaModule],
    controllers: [ShopController],
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
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: SHOP_EMPLOYEE_REPOSITORY,
            useClass: ShopEmployeeRepository,
        },
        {
            provide: PRODUCT_ARRIVAL_REPOSITORY,
            useClass: ProductArrivalRepository,
        },
        // Use Cases
        AddShopEmployeeUseCase,
        RemoveShopEmployeeUseCase,
        GetShopEmployeesUseCase,
        GetShopArrivalsUseCase,
        CreateShopReturnUseCase,
    ],
})
export class ShopModule { }
