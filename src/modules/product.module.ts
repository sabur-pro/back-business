import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { ProductController } from '@presentation/controllers/product.controller';
import {
    ProductRepository,
    PointRepository,
    UserRepository,
    PointMemberRepository,
    AccountRepository,
    WarehouseRepository,
    CounterpartyRepository,
} from '@infrastructure/database/repositories';
import {
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
import {
    POINT_REPOSITORY,
} from '@domain/repositories';
import {
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    POINT_MEMBER_REPOSITORY,
} from '@domain/repositories/point-member.repository.interface';
import {
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import {
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    CreateProductUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    BatchCreateProductsUseCase,
} from '@application/use-cases/product';

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [
        // Repositories
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductRepository,
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
            provide: POINT_MEMBER_REPOSITORY,
            useClass: PointMemberRepository,
        },
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: AccountRepository,
        },
        {
            provide: WAREHOUSE_REPOSITORY,
            useClass: WarehouseRepository,
        },
        {
            provide: COUNTERPARTY_REPOSITORY,
            useClass: CounterpartyRepository,
        },
        // Use Cases
        CreateProductUseCase,
        GetProductsUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
        BatchCreateProductsUseCase,
    ],
    exports: [PRODUCT_REPOSITORY],
})
export class ProductModule { }
