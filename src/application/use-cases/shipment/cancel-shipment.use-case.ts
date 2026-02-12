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
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import { UserRole } from '@domain/entities/user.entity';
import { ShipmentEntity, ShipmentStatus } from '@domain/entities/shipment.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class CancelShipmentUseCase {
    constructor(
        @Inject(SHIPMENT_REPOSITORY)
        private readonly shipmentRepository: IShipmentRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, shipmentId: string): Promise<ShipmentEntity> {
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

        // 3. Check status - can only cancel SENT shipments
        if (shipment.status !== ShipmentStatus.SENT && shipment.status !== ShipmentStatus.PENDING) {
            throw new BadRequestException(
                `Нельзя отменить отправку в статусе "${shipment.status}". Допустимые статусы: PENDING, SENT`,
            );
        }

        // 4. Check access (only receiver can cancel/reject)
        await this.checkReceiverAccess(userId, user.role, shipment.toPointId);

        // 5. Return products to sender's warehouse and cancel
        await this.prisma.$transaction(async (tx) => {
            // Return products to sender
            for (const item of shipment.items) {
                const product = await tx.product.findFirst({
                    where: {
                        id: item.productId,
                        accountId: shipment.fromAccountId,
                    },
                });

                if (product) {
                    const newBoxCount = product.boxCount + item.boxCount;
                    const newPairCount = product.pairCount + item.pairCount;
                    const newTotalYuan = Number(product.priceYuan) * newPairCount;
                    const newTotalRub = Number(product.priceRub) * newPairCount;

                    await tx.product.update({
                        where: { id: product.id },
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
            }

            // Update status to CANCELLED
            await tx.transfer.update({
                where: { id: shipmentId },
                data: { status: 'CANCELLED' },
            });
        });

        const updated = await this.shipmentRepository.findById(shipmentId);
        return updated!;
    }

    private async checkReceiverAccess(
        userId: string,
        userRole: UserRole,
        toPointId: string,
    ): Promise<void> {
        const userPoints = await this.pointRepository.findByUserId(userId);
        const isReceiver = userPoints.some((p) => p.id === toPointId);

        if (!isReceiver) {
            throw new ForbiddenException('Только получатель может отменить/отклонить отправку');
        }

        if (userRole === UserRole.ORGANIZER || userRole === UserRole.POINT_ADMIN) {
            return;
        }

        throw new ForbiddenException('Нет разрешения на отмену отправок');
    }
}
