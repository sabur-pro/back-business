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
    IProductRepository,
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
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
import { ShipmentEntity } from '@domain/entities/shipment.entity';
import { CreateShipmentDto } from '@application/dto/shipment';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class CreateShipmentUseCase {
    constructor(
        @Inject(SHIPMENT_REPOSITORY)
        private readonly shipmentRepository: IShipmentRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, dto: CreateShipmentDto): Promise<ShipmentEntity> {
        // 1. Validate user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // 2. Validate sender point
        const fromPoint = await this.pointRepository.findById(dto.fromPointId);
        if (!fromPoint) {
            throw new NotFoundException('Точка отправителя не найдена');
        }

        // 3. Check sender access
        const fromAccountId = fromPoint.accountId;
        await this.checkSenderAccess(userId, user.role, dto.fromPointId, fromAccountId);

        // 4. Validate receiver point
        const toPoint = await this.pointRepository.findById(dto.toPointId);
        if (!toPoint) {
            throw new NotFoundException('Точка получателя не найдена');
        }

        const toAccountId = toPoint.accountId;

        // 5. Get all sender warehouses for validation
        const senderWarehouses = await this.warehouseRepository.findByPointId(dto.fromPointId);
        const senderWarehouseIds = new Set(senderWarehouses.map(w => w.id));

        // 6. Validate products and calculate totals
        let totalYuan = 0;
        let totalRub = 0;
        const itemsData: Array<{
            productId: string;
            sku: string;
            photo: string | null;
            sizeRange: string | null;
            boxCount: number;
            pairCount: number;
            priceYuan: number;
            priceRub: number;
            totalYuan: number;
            totalRub: number;
        }> = [];

        for (const item of dto.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new NotFoundException(`Товар с ID "${item.productId}" не найден`);
            }

            if (product.accountId !== fromAccountId) {
                throw new ForbiddenException(`Товар "${product.sku}" не принадлежит аккаунту отправителя`);
            }

            if (!product.warehouseId || !senderWarehouseIds.has(product.warehouseId)) {
                throw new BadRequestException(`Товар "${product.sku}" не находится на складах данной точки`);
            }

            // Validate box/pair count
            if (item.boxCount > product.boxCount) {
                throw new BadRequestException(
                    `Недостаточно коробок товара "${product.sku}": запрошено ${item.boxCount}, доступно ${product.boxCount}`,
                );
            }

            if (item.pairCount > product.pairCount) {
                throw new BadRequestException(
                    `Недостаточно пар товара "${product.sku}": запрошено ${item.pairCount}, доступно ${product.pairCount}`,
                );
            }

            if (item.boxCount <= 0 && item.pairCount <= 0) {
                throw new BadRequestException(
                    `Для товара "${product.sku}" нужно указать количество коробок или пар`,
                );
            }

            // Calculate item totals
            const itemTotalYuan = product.priceYuan * item.pairCount;
            const itemTotalRub = product.priceRub * item.pairCount;

            totalYuan += itemTotalYuan;
            totalRub += itemTotalRub;

            itemsData.push({
                productId: product.id,
                sku: product.sku,
                photo: product.photo,
                sizeRange: product.sizeRange,
                boxCount: item.boxCount,
                pairCount: item.pairCount,
                priceYuan: product.priceYuan,
                priceRub: product.priceRub,
                totalYuan: Math.round(itemTotalYuan * 100) / 100,
                totalRub: Math.round(itemTotalRub * 100) / 100,
            });
        }

        // 7. Generate shipment number
        const number = await this.shipmentRepository.generateNumber();

        // 8. Create shipment and subtract stock in a transaction
        const shipment = await this.prisma.$transaction(async (tx) => {
            // Subtract products from sender
            for (const item of dto.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new NotFoundException(`Товар не найден: ${item.productId}`);
                }

                const newBoxCount = product.boxCount - item.boxCount;
                const newPairCount = product.pairCount - item.pairCount;

                // Recalculate totals based on pairCount
                const newTotalYuan = Number(product.priceYuan) * newPairCount;
                const newTotalRub = Number(product.priceRub) * newPairCount;

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        boxCount: newBoxCount,
                        pairCount: newPairCount,
                        totalYuan: Math.round(newTotalYuan * 100) / 100,
                        totalRub: Math.round(newTotalRub * 100) / 100,
                        totalRecommendedSale: Number(product.recommendedSalePrice) * newPairCount,
                        totalActualSale: Number(product.actualSalePrice) * newPairCount,
                    },
                });
            }

            // Create the transfer record
            const transfer = await tx.transfer.create({
                data: {
                    number,
                    fromAccountId,
                    toAccountId,
                    fromPointId: dto.fromPointId,
                    toPointId: dto.toPointId,
                    totalYuan: Math.round(totalYuan * 100) / 100,
                    totalRub: Math.round(totalRub * 100) / 100,
                    waybillPhoto: dto.waybillPhoto,
                    transportPhoto: dto.transportPhoto,
                    note: dto.note,
                    status: 'SENT',
                    sentAt: new Date(),
                    items: {
                        create: itemsData.map((item) => ({
                            productId: item.productId,
                            sku: item.sku,
                            photo: item.photo,
                            sizeRange: item.sizeRange,
                            boxCount: item.boxCount,
                            pairCount: item.pairCount,
                            priceYuan: item.priceYuan,
                            priceRub: item.priceRub,
                            totalYuan: item.totalYuan,
                            totalRub: item.totalRub,
                        })),
                    },
                },
                include: {
                    items: true,
                    fromAccount: { select: { id: true, name: true } },
                    toAccount: { select: { id: true, name: true } },
                    fromPoint: { select: { id: true, name: true } },
                    toPoint: { select: { id: true, name: true } },
                    fromWarehouse: { select: { id: true, name: true } },
                    toWarehouse: { select: { id: true, name: true } },
                },
            });

            return transfer;
        });

        return this.mapToEntity(shipment);
    }

    private mapToEntity(transfer: any): ShipmentEntity {
        return ShipmentEntity.create({
            id: transfer.id,
            number: transfer.number,
            fromAccountId: transfer.fromAccountId,
            toAccountId: transfer.toAccountId,
            fromPointId: transfer.fromPointId,
            toPointId: transfer.toPointId,
            fromWarehouseId: transfer.fromWarehouseId,
            toWarehouseId: transfer.toWarehouseId,
            totalYuan: transfer.totalYuan,
            totalRub: transfer.totalRub,
            waybillPhoto: transfer.waybillPhoto,
            transportPhoto: transfer.transportPhoto,
            receiverWaybillPhoto: transfer.receiverWaybillPhoto,
            status: transfer.status,
            note: transfer.note,
            sentAt: transfer.sentAt,
            receivedAt: transfer.receivedAt,
            confirmedAt: transfer.confirmedAt,
            createdAt: transfer.createdAt,
            updatedAt: transfer.updatedAt,
            items: transfer.items?.map((i: any) => ({
                id: i.id,
                transferId: i.transferId,
                productId: i.productId,
                sku: i.sku,
                photo: i.photo,
                sizeRange: i.sizeRange,
                boxCount: i.boxCount,
                pairCount: i.pairCount,
                priceYuan: Number(i.priceYuan),
                priceRub: Number(i.priceRub),
                totalYuan: Number(i.totalYuan),
                totalRub: Number(i.totalRub),
            })) ?? [],
            fromAccountName: transfer.fromAccount?.name,
            toAccountName: transfer.toAccount?.name,
            fromPointName: transfer.fromPoint?.name,
            toPointName: transfer.toPoint?.name,
            fromWarehouseName: transfer.fromWarehouse?.name,
            toWarehouseName: transfer.toWarehouse?.name,
        });
    }

    private async checkSenderAccess(
        userId: string,
        userRole: UserRole,
        pointId: string,
        accountId: string,
    ): Promise<void> {
        if (userRole === UserRole.ORGANIZER) {
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.id === pointId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к точке отправителя');
            }
            return;
        }

        if (userRole === UserRole.POINT_ADMIN) {
            const user = await this.userRepository.findById(userId);
            if (!user || !user.canCreateShipment) {
                throw new ForbiddenException('У вас нет разрешения на создание отправок');
            }
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.id === pointId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к точке отправителя');
            }
            return;
        }

        throw new ForbiddenException('Нет разрешения на создание отправок');
    }
}
