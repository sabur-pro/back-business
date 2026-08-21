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
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IAuditLogRepository,
    AUDIT_LOG_REPOSITORY,
} from '@domain/repositories/audit-log.repository.interface';
import { ShipmentStatus } from '@domain/entities/shipment.entity';
import { AuditAction } from '@domain/entities/audit-log.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

/**
 * Удаление заявки (отправки) — доступно только девелоперу («под организатором»).
 * Перед удалением выполняется откат движения товара в зависимости от статуса:
 *  - PENDING / SENT — товар «в пути»: возвращаем отправителю;
 *  - CONFIRMED (принята) — товар у получателя: возвращаем отправителю и снимаем у получателя;
 *  - CANCELLED — товар уже возвращён отправителю: движения не требуется.
 * Затем запись отправки (и её позиции) удаляются физически.
 */
@Injectable()
export class DeleteShipmentUseCase {
    constructor(
        @Inject(SHIPMENT_REPOSITORY)
        private readonly shipmentRepository: IShipmentRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(AUDIT_LOG_REPOSITORY)
        private readonly auditLogRepository: IAuditLogRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, shipmentId: string, isDeveloper: boolean): Promise<{ success: true }> {
        // 1. Право удаления есть только у девелопера
        if (!isDeveloper) {
            throw new ForbiddenException('Удалять заявки может только девелопер');
        }

        // 2. Пользователь (организатор, под которым работает девелопер)
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // 3. Заявка
        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) {
            throw new NotFoundException('Заявка не найдена');
        }

        // 4. Заявка должна принадлежать организации (как отправитель или получатель)
        const belongsToOrg =
            shipment.fromAccountId === user.accountId || shipment.toAccountId === user.accountId;
        if (!belongsToOrg) {
            throw new ForbiddenException('Заявка не принадлежит вашей организации');
        }

        // 5. Нельзя удалять заявку с привязанным долгом (иначе нарушится учёт взаиморасчётов)
        const debt = await this.prisma.debt.findUnique({ where: { transferId: shipmentId } });
        if (debt) {
            throw new BadRequestException(
                'Нельзя удалить заявку, по которой есть долг. Сначала закройте долг.',
            );
        }

        // 6. Откат движения товара + удаление записи в одной транзакции
        await this.prisma.$transaction(async (tx) => {
            if (
                shipment.status === ShipmentStatus.PENDING ||
                shipment.status === ShipmentStatus.SENT
            ) {
                await this.returnToSender(tx, shipment);
            } else if (shipment.status === ShipmentStatus.CONFIRMED) {
                await this.returnToSender(tx, shipment);
                await this.removeFromReceiver(tx, shipment);
            }
            // CANCELLED — товар уже вернулся отправителю, движения не требуется

            // Позиции удалятся каскадно (onDelete: Cascade), но удалим явно для наглядности
            await tx.transferItem.deleteMany({ where: { transferId: shipmentId } });
            await tx.transfer.delete({ where: { id: shipmentId } });
        });

        // 7. Аудит
        await this.auditLogRepository.create({
            action: AuditAction.SHIPMENT_DELETED,
            entityType: 'SHIPMENT',
            entityId: shipmentId,
            userId,
            accountId: shipment.fromAccountId,
            oldData: {
                number: shipment.number,
                status: shipment.status,
                totalYuan: shipment.totalYuan,
                totalRub: shipment.totalRub,
                itemCount: shipment.items.length,
            },
        });

        return { success: true };
    }

    /** Вернуть товары отправителю (реверс создания отправки). */
    private async returnToSender(tx: any, shipment: any): Promise<void> {
        for (const item of shipment.items) {
            if (!item.productId) continue;
            const product = await tx.product.findFirst({
                where: { id: item.productId, accountId: shipment.fromAccountId },
            });
            if (!product) continue;

            const newBoxCount = product.boxCount + item.boxCount;
            const newPairCount = product.pairCount + item.pairCount;
            await this.updateProductCounts(tx, product, newBoxCount, newPairCount);
        }
    }

    /** Снять товары у получателя (реверс приёмки). Не уходим в минус. */
    private async removeFromReceiver(tx: any, shipment: any): Promise<void> {
        for (const item of shipment.items) {
            const product = await tx.product.findFirst({
                where: { sku: item.sku, accountId: shipment.toAccountId },
            });
            if (!product) continue;

            const newBoxCount = Math.max(0, product.boxCount - item.boxCount);
            const newPairCount = Math.max(0, product.pairCount - item.pairCount);
            await this.updateProductCounts(tx, product, newBoxCount, newPairCount);
        }
    }

    /** Пересчитать количества и производные суммы товара. */
    private async updateProductCounts(
        tx: any,
        product: any,
        newBoxCount: number,
        newPairCount: number,
    ): Promise<void> {
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
