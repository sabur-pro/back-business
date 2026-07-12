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
import {
    IAuditLogRepository,
    AUDIT_LOG_REPOSITORY,
} from '@domain/repositories/audit-log.repository.interface';
import { ProductEntity } from '@domain/entities/product.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { UserRole } from '@domain/entities/user.entity';
import { CounterpartyType } from '@domain/entities/counterparty.entity';
import { CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';
import { AuditAction } from '@domain/entities/audit-log.entity';
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
        @Inject(AUDIT_LOG_REPOSITORY)
        private readonly auditLogRepository: IAuditLogRepository,
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

        // Resolve target warehouse + existing product for each item
        const resolvedItems = await Promise.all(
            dto.items.map(async (item) => {
                const warehouseId = shopWarehouse
                    ? shopWarehouse.id
                    : warehouseCache.get(this.getWarehouseNameBySku(item.sku))!;
                const existingProduct = await this.productRepository.findBySkuAndAccountId(item.sku, accountId, warehouseId);
                const isRestock = item.mode === 'restock';

                // Guard: creating a product that already exists is not allowed —
                // the client must explicitly choose the restock mode.
                if (existingProduct && !isRestock) {
                    const label = shopWarehouse ? shopWarehouse.name : this.getWarehouseNameBySku(item.sku);
                    throw new ConflictException(`Товар с артикулом "${item.sku}" уже существует на складе "${label}". Выберите «повторный приход», чтобы пополнить существующий товар.`);
                }

                // Guard: restock requested but the product doesn't exist yet — create it instead.
                if (isRestock && !existingProduct) {
                    return { item, warehouseId, existingProduct: null, isRestock: false };
                }

                return { item, warehouseId, existingProduct, isRestock };
            }),
        );

        // Create brand-new products
        const createData = resolvedItems
            .filter((r) => !r.isRestock)
            .map(({ item, warehouseId }) => ({
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
            }));

        const createdProducts = createData.length > 0
            ? await this.productRepository.createMany(createData)
            : [];

        // Restock existing products (повторный приход) — add quantities & value
        const restockedProducts: ProductEntity[] = [];
        const restockAuditLogs: any[] = [];
        for (const { item, existingProduct } of resolvedItems.filter((r) => r.isRestock && r.existingProduct)) {
            const prev = existingProduct!;
            const newBoxCount = prev.boxCount + item.boxCount;
            const newPairCount = prev.pairCount + item.pairCount;
            const newTotalYuan = prev.totalYuan + item.totalYuan;
            const newTotalRub = prev.totalRub + item.totalRub;
            const newTotalRecommendedSale = prev.totalRecommendedSale + (item.totalRecommendedSale ?? 0);

            const updated = await this.productRepository.update(prev.id, {
                boxCount: newBoxCount,
                pairCount: newPairCount,
                totalYuan: newTotalYuan,
                totalRub: newTotalRub,
                totalRecommendedSale: newTotalRecommendedSale,
                // Reflect the latest arrival price on the product card
                priceYuan: item.priceYuan,
                priceRub: item.priceRub,
                recommendedSalePrice: item.recommendedSalePrice ?? prev.recommendedSalePrice,
            });
            restockedProducts.push(updated);

            // Log the arrival delta (this receipt's amounts) so it appears in receipt history
            restockAuditLogs.push({
                action: AuditAction.PRODUCT_BATCH_CREATED,
                entityType: 'PRODUCT',
                entityId: prev.id,
                userId,
                accountId,
                newData: {
                    sku: prev.sku,
                    photoOriginal: prev.photoOriginal,
                    photo: prev.photo,
                    sizeRange: item.sizeRange ?? prev.sizeRange,
                    boxCount: item.boxCount,
                    pairCount: item.pairCount,
                    priceYuan: item.priceYuan,
                    priceRub: item.priceRub,
                    totalYuan: item.totalYuan,
                    totalRub: item.totalRub,
                    recommendedSalePrice: item.recommendedSalePrice ?? 0,
                    totalRecommendedSale: item.totalRecommendedSale ?? 0,
                    barcode: prev.barcode,
                    warehouseId: prev.warehouseId,
                },
                metadata: {
                    pointId: dto.pointId,
                    pointName: point.name,
                    supplierId: dto.supplierId ?? null,
                    restock: true,
                    stockBefore: prev.pairCount,
                    stockAfter: newPairCount,
                },
            });
        }

        const products = [...createdProducts, ...restockedProducts];

        // Handle supplier tracking
        if (dto.supplierId) {
            const supplier = await this.counterpartyRepository.findById(dto.supplierId);
            if (!supplier) {
                throw new NotFoundException('Поставщик не найден');
            }
            if (supplier.type !== CounterpartyType.SUPPLIER) {
                throw new BadRequestException('Указанный контрагент не является поставщиком');
            }

            // Calculate total goods value across the whole receipt (new + restocked)
            const totalGoodsRub = dto.items.reduce((sum, item) => sum + item.totalRub, 0);
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

        // Record audit logs for newly created products
        const createAuditLogs = createdProducts.map((product) => ({
            action: AuditAction.PRODUCT_BATCH_CREATED,
            entityType: 'PRODUCT',
            entityId: product.id,
            userId,
            accountId,
            newData: {
                sku: product.sku,
                photoOriginal: product.photoOriginal,
                photo: product.photo,
                sizeRange: product.sizeRange,
                boxCount: product.boxCount,
                pairCount: product.pairCount,
                priceYuan: product.priceYuan,
                priceRub: product.priceRub,
                totalYuan: product.totalYuan,
                totalRub: product.totalRub,
                recommendedSalePrice: product.recommendedSalePrice,
                totalRecommendedSale: product.totalRecommendedSale,
                barcode: product.barcode,
                warehouseId: product.warehouseId,
            },
            metadata: {
                pointId: dto.pointId,
                pointName: point.name,
                supplierId: dto.supplierId ?? null,
                batchSize: products.length,
            },
        }));
        const auditLogs = [...createAuditLogs, ...restockAuditLogs];
        if (auditLogs.length > 0) {
            await this.auditLogRepository.createMany(auditLogs);
        }

        return {
            products,
            count: products.length,
            createdCount: createdProducts.length,
            restockedCount: restockedProducts.length,
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
