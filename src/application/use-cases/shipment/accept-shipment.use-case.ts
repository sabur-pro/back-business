import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    IShipmentRepository,
    SHIPMENT_REPOSITORY,
} from '@domain/repositories/shipment.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import { UserRole } from '@domain/entities/user.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { ShipmentEntity, ShipmentStatus } from '@domain/entities/shipment.entity';
import { AcceptShipmentDto } from '@application/dto/shipment';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class AcceptShipmentUseCase {
    constructor(
        @Inject(SHIPMENT_REPOSITORY)
        private readonly shipmentRepository: IShipmentRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly prisma: PrismaService,
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
        throw new BadRequestException(`Артикул "${sku}" не начинается на A/А или B/В`);
    }

    async execute(
        userId: string,
        shipmentId: string,
        dto: AcceptShipmentDto,
    ): Promise<ShipmentEntity> {
        // 1. Validate user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // 2. Get shipment
        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) {
            throw new NotFoundException('Отправка не найдена');
        }

        // 3. Check status
        if (shipment.status !== ShipmentStatus.SENT) {
            throw new BadRequestException(
                `Нельзя принять отправку в статусе "${shipment.status}". Допустимый статус: SENT`,
            );
        }

        // 4. Check receiver access (sender cannot accept)
        await this.checkReceiverAccess(userId, user.role, shipment.toPointId, shipment.toAccountId);

        // 5. Resolve receiver warehouses
        // If the destination point has a SHOP, route all products directly to the shop.
        // Otherwise, fall back to SKU-prefix-based routing ("Мужской" / "Женский").
        const shops = await this.warehouseRepository.findByPointIdAndType(shipment.toPointId, WarehouseType.SHOP);
        const shopWarehouse = shops.length > 0 ? shops[0] : null;

        const warehouseCache = new Map<string, string>();

        if (!shopWarehouse) {
            // No shop — resolve by SKU prefix
            for (const item of shipment.items) {
                const warehouseName = this.getWarehouseNameBySku(item.sku);
                if (!warehouseCache.has(warehouseName)) {
                    const warehouse = await this.warehouseRepository.findByPointIdAndName(shipment.toPointId, warehouseName);
                    if (!warehouse) {
                        throw new NotFoundException(`Склад "${warehouseName}" не найден в точке получателя. Создайте склад с названием "${warehouseName}".`);
                    }
                    warehouseCache.set(warehouseName, warehouse.id);
                }
            }
        }

        // 6. Accept shipment: add products to receiver warehouses (no debt)
        const now = new Date();

        await this.prisma.$transaction(async (tx) => {
            for (const item of shipment.items) {
                // If shop exists — all go to shop; otherwise resolve by SKU
                const targetWarehouseId = shopWarehouse
                    ? shopWarehouse.id
                    : warehouseCache.get(this.getWarehouseNameBySku(item.sku))!;

                // Check if product with same SKU already exists in receiver's target warehouse
                const existingProduct = await tx.product.findFirst({
                    where: {
                        sku: item.sku,
                        accountId: shipment.toAccountId,
                        warehouseId: targetWarehouseId,
                    },
                });

                if (existingProduct) {
                    const newBoxCount = existingProduct.boxCount + item.boxCount;
                    const newPairCount = existingProduct.pairCount + item.pairCount;
                    const newTotalYuan = Number(existingProduct.priceYuan) * newPairCount;
                    const newTotalRub = Number(existingProduct.priceRub) * newPairCount;

                    await tx.product.update({
                        where: { id: existingProduct.id },
                        data: {
                            boxCount: newBoxCount,
                            pairCount: newPairCount,
                            totalYuan: Math.round(newTotalYuan * 100) / 100,
                            totalRub: Math.round(newTotalRub * 100) / 100,
                            totalRecommendedSale: Number(existingProduct.recommendedSalePrice) * newPairCount,
                            totalActualSale: Number(existingProduct.actualSalePrice) * newPairCount,
                        },
                    });
                } else {
                    await tx.product.create({
                        data: {
                            sku: item.sku,
                            photo: item.photo,
                            sizeRange: item.sizeRange,
                            boxCount: item.boxCount,
                            pairCount: item.pairCount,
                            priceYuan: item.priceYuan,
                            priceRub: item.priceRub,
                            totalYuan: item.totalYuan,
                            totalRub: item.totalRub,
                            recommendedSalePrice: 0,
                            totalRecommendedSale: 0,
                            actualSalePrice: 0,
                            totalActualSale: 0,
                            accountId: shipment.toAccountId,
                            warehouseId: targetWarehouseId,
                        },
                    });
                }
            }

            // Update transfer status
            await tx.transfer.update({
                where: { id: shipmentId },
                data: {
                    status: 'CONFIRMED',
                    receiverWaybillPhoto: dto.receiverWaybillPhoto,
                    receivedAt: now,
                    confirmedAt: now,
                },
            });
        });

        // Return updated shipment
        const updated = await this.shipmentRepository.findById(shipmentId);
        return updated!;
    }

    private async checkReceiverAccess(
        userId: string,
        userRole: UserRole,
        pointId: string,
        accountId: string,
    ): Promise<void> {
        if (userRole === UserRole.ORGANIZER) {
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.id === pointId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к точке получателя');
            }
            return;
        }

        if (userRole === UserRole.POINT_ADMIN) {
            const user = await this.userRepository.findById(userId);
            if (!user || !user.canReceiveShipment) {
                throw new ForbiddenException('У вас нет разрешения на приёмку отправок');
            }
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.id === pointId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к точке получателя');
            }
            return;
        }

        throw new ForbiddenException('Нет разрешения на приёмку отправок');
    }
}
