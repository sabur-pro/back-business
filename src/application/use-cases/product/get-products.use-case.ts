import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
    ProductSearchParams,
    PaginatedProducts,
} from '@domain/repositories/product.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import { ProductEntity } from '@domain/entities/product.entity';
import { UserRole } from '@domain/entities/user.entity';
import {
    IAccountRepository,
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';

@Injectable()
export class GetProductsUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(userId: string): Promise<ProductEntity[]> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        if (user.role === UserRole.ORGANIZER) {
            // Get all products from owned accounts
            const accounts = await this.accountRepository.findByOwnerId(userId);
            const allProducts: ProductEntity[] = [];
            for (const account of accounts) {
                const products = await this.productRepository.findByAccountId(account.id);
                allProducts.push(...products);
            }
            return allProducts;
        }

        // POINT_ADMIN - get products from their account
        if (user.accountId) {
            return this.productRepository.findByAccountId(user.accountId);
        }

        return [];
    }

    async executePaginated(userId: string, accountId: string, params: ProductSearchParams): Promise<PaginatedProducts> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Verify access to the account
        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(userId);
            const hasAccess = accounts.some((a) => a.id === accountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данному аккаунту');
            }
        } else if (user.accountId !== accountId) {
            throw new ForbiddenException('Нет доступа к данному аккаунту');
        }

        return this.productRepository.findByAccountIdPaginated(accountId, params);
    }

    async executeByWarehouseIdPaginated(userId: string, warehouseId: string, params: ProductSearchParams): Promise<PaginatedProducts> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Verify user has access via points
        const userPoints = await this.pointRepository.findByUserId(userId);
        if (userPoints.length === 0) {
            throw new ForbiddenException('Нет доступа');
        }

        return this.productRepository.findByWarehouseIdPaginated(warehouseId, params);
    }

    async executeByPointIdPaginated(userId: string, pointId: string, params: ProductSearchParams): Promise<PaginatedProducts> {
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new ForbiddenException('Точка не найдена');
        }

        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === pointId);
        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        return this.productRepository.findByPointIdPaginated(pointId, params);
    }

    async executeByPointId(userId: string, pointId: string): Promise<ProductEntity[]> {
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new ForbiddenException('Точка не найдена');
        }

        // Verify user has access to the point
        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === pointId);
        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        return this.productRepository.findByAccountId(point.accountId);
    }
}
