import { Inject, Injectable, ForbiddenException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IPointMemberRepository,
    POINT_MEMBER_REPOSITORY,
} from '@domain/repositories/point-member.repository.interface';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import { ProductEntity } from '@domain/entities/product.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { UserRole } from '@domain/entities/user.entity';
import { CounterpartyType } from '@domain/entities/counterparty.entity';
import { CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';
import { BatchCreateProductsDto, BatchCreateProductsResponseDto } from '@application/dto/product';

@Injectable()
export class BatchCreateProductsUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(POINT_MEMBER_REPOSITORY)
        private readonly pointMemberRepository: IPointMemberRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
    ) { }

    private normalizeSkuPrefix(char: string): string {
        const upper = char.toUpperCase();
        if (upper === 'A' || upper === '\u0410') return 'A';
        if (upper === 'B' || upper === '\u0412') return 'B';
        return upper;
    }

    private getWarehouseNameBySku(sku: string): string {
        const prefix = this.normalizeSkuPrefix(sku.trim().charAt(0));
        if (prefix === 'A') return 'Мужской';
        if (prefix === 'B') return 'Женский';
        throw new BadRequestException(`Артикул "${sku}" должен начинаться на A/А (Мужской) или B/В (Женский)`);
    }

    async execute(userId: string, dto: BatchCreateProductsDto): Promise<BatchCreateProductsResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        const point = await this.pointRepository.findById(dto.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        const accountId = point.accountId;

        // Check permissions
        await this.checkPermissions(userId, user.role, dto.pointId, accountId);

        // Check if point has a shop but no regular warehouses — route all to shop
        const shops = await this.warehouseRepository.findByPointIdAndType(dto.pointId, WarehouseType.SHOP);
        const regularWarehouses = await this.warehouseRepository.findByPointIdAndType(dto.pointId, WarehouseType.WAREHOUSE);
        const shopOnly = shops.length > 0 && regularWarehouses.length === 0;
        const shopWarehouse = shopOnly ? shops[0] : null;

        // Resolve warehouses for each product
        const warehouseCache = new Map<string, string>();
        if (!shopWarehouse) {
            // No shop-only scenario — resolve by SKU prefix
            for (const item of dto.items) {
                const warehouseName = this.getWarehouseNameBySku(item.sku);
                if (!warehouseCache.has(warehouseName)) {
                    const warehouse = await this.warehouseRepository.findByPointIdAndName(dto.pointId, warehouseName);
                    if (!warehouse) {
                        throw new NotFoundException(`Склад "${warehouseName}" не найден в данной точке. Создайте склад с названием "${warehouseName}".`);
                    }
                    warehouseCache.set(warehouseName, warehouse.id);
                }
            }
        }

        // Check for duplicate SKUs within the batch
        const skus = dto.items.map((item) => item.sku);
        const uniqueSkus = new Set(skus);
        if (uniqueSkus.size !== skus.length) {
            throw new ConflictException('В партии есть товары с одинаковыми артикулами');
        }

        // Validate SKU uniqueness for all items within account + warehouse
        for (const item of dto.items) {
            const targetWarehouseId = shopWarehouse
                ? shopWarehouse.id
                : warehouseCache.get(this.getWarehouseNameBySku(item.sku))!;
            const existingProduct = await this.productRepository.findBySkuAndAccountId(item.sku, accountId, targetWarehouseId);
            if (existingProduct) {
                const label = shopWarehouse ? shopWarehouse.name : this.getWarehouseNameBySku(item.sku);
                throw new ConflictException(`Товар с артикулом "${item.sku}" уже существует на складе "${label}"`);
            }
        }

        // Create all products
        const createData = dto.items.map((item) => {
            const warehouseId = shopWarehouse
                ? shopWarehouse.id
                : warehouseCache.get(this.getWarehouseNameBySku(item.sku))!;
            return {
                sku: item.sku,
                photoOriginal: item.photoOriginal,
                photo: item.photo,
                sizeRange: item.sizeRange,
                boxCount: item.boxCount,
                pairCount: item.pairCount,
                priceYuan: item.priceYuan,
                priceRub: item.priceRub,
                totalYuan: item.totalYuan,
                totalRub: item.totalRub,
                recommendedSalePrice: item.recommendedSalePrice ?? 0,
                totalRecommendedSale: item.totalRecommendedSale ?? 0,
                actualSalePrice: item.actualSalePrice ?? 0,
                totalActualSale: item.totalActualSale ?? 0,
                barcode: item.barcode,
                accountId,
                warehouseId,
            };
        });

        const products = await this.productRepository.createMany(createData);

        // Handle supplier tracking
        if (dto.supplierId) {
            const supplier = await this.counterpartyRepository.findById(dto.supplierId);
            if (!supplier) {
                throw new NotFoundException('Поставщик не найден');
            }
            if (supplier.type !== CounterpartyType.SUPPLIER) {
                throw new BadRequestException('Указанный контрагент не является поставщиком');
            }

            // Calculate total goods value
            const totalGoodsRub = createData.reduce((sum, item) => sum + item.totalRub, 0);
            const roundedTotal = Math.round(totalGoodsRub * 100) / 100;

            // Record goods received from supplier (increases our debt)
            await this.counterpartyRepository.createTransaction({
                counterpartyId: dto.supplierId,
                type: CounterpartyTransactionType.GOODS_RECEIVED,
                amount: roundedTotal,
                description: `Приход товаров на сумму ${roundedTotal} руб.`,
            });
            await this.counterpartyRepository.updateBalance(dto.supplierId, roundedTotal);

            // Record payment if any
            const paidAmount = dto.paidAmount ?? 0;
            if (paidAmount > 0) {
                await this.counterpartyRepository.createTransaction({
                    counterpartyId: dto.supplierId,
                    type: CounterpartyTransactionType.PAYMENT_OUT,
                    amount: paidAmount,
                    description: `Оплата поставщику при приходе`,
                });
                await this.counterpartyRepository.updateBalance(dto.supplierId, -paidAmount);
            }
        }

        return {
            products,
            count: products.length,
        };
    }

    private async checkPermissions(
        userId: string,
        userRole: UserRole,
        pointId: string,
        accountId: string,
    ): Promise<void> {
        if (userRole === UserRole.ORGANIZER) {
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.id === pointId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данной точке');
            }
            return;
        }

        if (userRole === UserRole.POINT_ADMIN) {
            const membership = await this.pointMemberRepository.findByPointAndUser(pointId, userId);
            if (!membership) {
                throw new ForbiddenException('Нет доступа к данной точке');
            }

            const user = await this.userRepository.findById(userId);
            if (!user || !user.canAddProducts) {
                throw new ForbiddenException('Организатор не предоставил право добавления товаров');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }
}
