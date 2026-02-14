import {
    Inject,
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { CreatePayoutDto } from '@application/dto/cash-register';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class PayoutUseCase {
    constructor(
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly prisma: PrismaService,
    ) { }

    async create(userId: string, dto: CreatePayoutDto) {
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const point = await this.pointRepository.findById(shop.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);

        const cashAmount = dto.cashAmount ?? 0;
        const safeAmount = dto.safeAmount ?? 0;
        const cardAmount = dto.cardAmount ?? 0;
        const totalAmount = cashAmount + safeAmount + cardAmount;

        if (totalAmount <= 0) {
            throw new BadRequestException('Общая сумма выдачи должна быть больше 0');
        }

        if (cashAmount > 0 && register.balance < cashAmount) {
            throw new BadRequestException(
                `Недостаточно наличных. Баланс: ${register.balance}, Запрошено: ${cashAmount}`,
            );
        }

        if (safeAmount > 0 && register.safeBalance < safeAmount) {
            throw new BadRequestException(
                `Недостаточно средств в сейфе. Баланс: ${register.safeBalance}, Запрошено: ${safeAmount}`,
            );
        }

        if (cardAmount > 0 && register.cardBalance < cardAmount) {
            throw new BadRequestException(
                `Недостаточно средств на карте. Баланс: ${register.cardBalance}, Запрошено: ${cardAmount}`,
            );
        }

        // Generate payout number
        const count = await this.prisma.payout.count();
        const number = `PAY-${String(count + 1).padStart(6, '0')}`;

        const payout = await this.prisma.payout.create({
            data: {
                number,
                cashRegisterId: register.id,
                shopId: dto.shopId,
                accountId: point.accountId,
                cashAmount,
                safeAmount,
                cardAmount,
                totalAmount,
                status: 'PENDING',
                note: dto.note,
                createdById: userId,
            },
        });

        return this.mapToResponse(payout);
    }

    async approve(userId: string, payoutId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        if (user.role !== 'ORGANIZER') {
            throw new ForbiddenException('Только организатор может одобрить выдачу');
        }

        const payout = await this.prisma.payout.findUnique({
            where: { id: payoutId },
        });

        if (!payout) {
            throw new NotFoundException('Выдача не найдена');
        }

        if (payout.status !== 'PENDING') {
            throw new BadRequestException('Выдача уже обработана');
        }

        const register = await this.cashRegisterRepository.findByShopId(payout.shopId);
        if (!register) {
            throw new NotFoundException('Касса не найдена');
        }

        const cashAmount = Number(payout.cashAmount);
        const safeAmount = Number(payout.safeAmount);
        const cardAmount = Number(payout.cardAmount);

        // Verify balances again before deducting
        if (cashAmount > 0 && register.balance < cashAmount) {
            throw new BadRequestException(
                `Недостаточно наличных. Баланс: ${register.balance}, Запрошено: ${cashAmount}`,
            );
        }
        if (safeAmount > 0 && register.safeBalance < safeAmount) {
            throw new BadRequestException(
                `Недостаточно средств в сейфе. Баланс: ${register.safeBalance}, Запрошено: ${safeAmount}`,
            );
        }
        if (cardAmount > 0 && register.cardBalance < cardAmount) {
            throw new BadRequestException(
                `Недостаточно средств на карте. Баланс: ${register.cardBalance}, Запрошено: ${cardAmount}`,
            );
        }

        // Deduct from cash
        if (cashAmount > 0) {
            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.PAYOUT_CASH,
                amount: cashAmount,
                description: `Выдача ${payout.number} (наличные)`,
                relatedId: payout.id,
            });
            await this.cashRegisterRepository.updateBalance(register.id, -cashAmount);
        }

        // Deduct from safe
        if (safeAmount > 0) {
            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.PAYOUT_SAFE,
                amount: safeAmount,
                description: `Выдача ${payout.number} (сейф)`,
                relatedId: payout.id,
            });
            await this.cashRegisterRepository.updateSafeBalance(register.id, -safeAmount);
        }

        // Deduct from card
        if (cardAmount > 0) {
            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.PAYOUT_CARD,
                amount: cardAmount,
                description: `Выдача ${payout.number} (карта)`,
                relatedId: payout.id,
            });
            await this.cashRegisterRepository.updateCardBalance(register.id, -cardAmount);
        }

        // Update payout status
        const updated = await this.prisma.payout.update({
            where: { id: payoutId },
            data: {
                status: 'APPROVED',
                approvedById: userId,
                approvedAt: new Date(),
            },
        });

        return this.mapToResponse(updated);
    }

    async reject(userId: string, payoutId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        if (user.role !== 'ORGANIZER') {
            throw new ForbiddenException('Только организатор может отклонить выдачу');
        }

        const payout = await this.prisma.payout.findUnique({
            where: { id: payoutId },
        });

        if (!payout) {
            throw new NotFoundException('Выдача не найдена');
        }

        if (payout.status !== 'PENDING') {
            throw new BadRequestException('Выдача уже обработана');
        }

        const updated = await this.prisma.payout.update({
            where: { id: payoutId },
            data: {
                status: 'REJECTED',
                approvedById: userId,
                approvedAt: new Date(),
            },
        });

        return this.mapToResponse(updated);
    }

    async getByShopId(shopId: string, params: { page?: number; limit?: number; status?: string }) {
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { shopId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.payout.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.payout.count({ where }),
        ]);

        return {
            items: items.map((p: any) => this.mapToResponse(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getByAccountId(accountId: string, params: { page?: number; limit?: number; status?: string }) {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { accountId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.payout.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.payout.count({ where }),
        ]);

        return {
            items: items.map((p: any) => this.mapToResponse(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getById(id: string) {
        const payout = await this.prisma.payout.findUnique({
            where: { id },
        });

        if (!payout) {
            throw new NotFoundException('Выдача не найдена');
        }

        return this.mapToResponse(payout);
    }

    private mapToResponse(payout: any) {
        return {
            id: payout.id,
            number: payout.number,
            cashRegisterId: payout.cashRegisterId,
            shopId: payout.shopId,
            accountId: payout.accountId,
            cashAmount: Number(payout.cashAmount),
            safeAmount: Number(payout.safeAmount),
            cardAmount: Number(payout.cardAmount),
            totalAmount: Number(payout.totalAmount),
            status: payout.status,
            note: payout.note,
            createdById: payout.createdById,
            approvedById: payout.approvedById,
            approvedAt: payout.approvedAt,
            createdAt: payout.createdAt,
            updatedAt: payout.updatedAt,
        };
    }
}
