import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { CheckExistingSkusDto, CheckExistingSkusResponseDto } from '@application/dto/product';

@Injectable()
export class CheckExistingSkusUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
    ) { }

    private normalizeSkuPrefix(char: string): string {
        const upper = char.toUpperCase();
        if (upper === 'A' || upper === 'А') return 'A';
        if (upper === 'B' || upper === 'В') return 'B';
        return upper;
    }

    private getWarehouseNameBySku(sku: string): string | null {
        const prefix = this.normalizeSkuPrefix(sku.trim().charAt(0));
        if (prefix === 'A') return 'Мужской';
        if (prefix === 'B') return 'Женский';
        return null;
    }

    async execute(userId: string, dto: CheckExistingSkusDto): Promise<CheckExistingSkusResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        const point = await this.pointRepository.findById(dto.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        const accountId = point.accountId;

        // Determine whether the point routes everything to a shop warehouse
        const shops = await this.warehouseRepository.findByPointIdAndType(dto.pointId, WarehouseType.SHOP);
        const regularWarehouses = await this.warehouseRepository.findByPointIdAndType(dto.pointId, WarehouseType.WAREHOUSE);
        const shopOnly = shops.length > 0 && regularWarehouses.length === 0;
        const shopWarehouse = shopOnly ? shops[0] : null;

        const warehouseCache = new Map<string, string>();
        const existing: CheckExistingSkusResponseDto['existing'] = [];

        for (const rawSku of dto.skus) {
            const sku = rawSku.trim();
            if (!sku) continue;

            let targetWarehouseId: string | undefined;
            let warehouseLabel: string;

            if (shopWarehouse) {
                targetWarehouseId = shopWarehouse.id;
                warehouseLabel = shopWarehouse.name;
            } else {
                const warehouseName = this.getWarehouseNameBySku(sku);
                if (!warehouseName) continue; // invalid prefix — skip, handled elsewhere
                warehouseLabel = warehouseName;
                if (!warehouseCache.has(warehouseName)) {
                    const warehouse = await this.warehouseRepository.findByPointIdAndName(dto.pointId, warehouseName);
                    if (!warehouse) continue; // no such warehouse — can't exist there
                    warehouseCache.set(warehouseName, warehouse.id);
                }
                targetWarehouseId = warehouseCache.get(warehouseName);
            }

            const product = await this.productRepository.findBySkuAndAccountId(sku, accountId, targetWarehouseId);
            if (product) {
                existing.push({
                    sku,
                    productId: product.id,
                    warehouseName: warehouseLabel,
                    boxCount: product.boxCount,
                    pairCount: product.pairCount,
                    priceRub: product.priceRub,
                });
            }
        }

        return { existing };
    }
}
