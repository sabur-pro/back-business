import {
    Inject,
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { CreateExpenseDto } from '@application/dto/cash-register';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class CreateExpenseUseCase {
    constructor(
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, dto: CreateExpenseDto) {
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
        const paymentMethod = dto.paymentMethod ?? 'CASH';

        if (paymentMethod === 'CASH') {
            if (register.balance < dto.amount) {
                throw new BadRequestException(
                    `Недостаточно наличных. Баланс: ${register.balance}, Запрошено: ${dto.amount}`,
                );
            }
        } else if (paymentMethod === 'CARD') {
            if (register.cardBalance < dto.amount) {
                throw new BadRequestException(
                    `Недостаточно средств на карте. Баланс: ${register.cardBalance}, Запрошено: ${dto.amount}`,
                );
            }
        }

        // Create expense record
        const expense = await this.prisma.expense.create({
            data: {
                cashRegisterId: register.id,
                category: dto.category,
                amount: dto.amount,
                description: dto.description,
                paymentMethod: paymentMethod as any,
                createdById: userId,
            },
        });

        // Create cash transaction
        await this.cashRegisterRepository.createTransaction({
            cashRegisterId: register.id,
            type: CashTransactionType.EXPENSE,
            amount: dto.amount,
            description: `Расход: ${dto.category}${dto.description ? ' - ' + dto.description : ''} (${paymentMethod === 'CARD' ? 'карта' : 'наличные'})`,
            relatedId: expense.id,
        });

        // Deduct from appropriate balance
        if (paymentMethod === 'CARD') {
            await this.cashRegisterRepository.updateCardBalance(register.id, -dto.amount);
        } else {
            await this.cashRegisterRepository.updateBalance(register.id, -dto.amount);
        }

        return {
            id: expense.id,
            cashRegisterId: expense.cashRegisterId,
            category: expense.category,
            amount: Number(expense.amount),
            description: expense.description,
            paymentMethod: expense.paymentMethod,
            createdById: expense.createdById,
            createdAt: expense.createdAt,
        };
    }

    async getExpenses(shopId: string, params: { page?: number; limit?: number }) {
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(shopId);

        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where = { cashRegisterId: register.id };

        const [items, total] = await Promise.all([
            this.prisma.expense.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.expense.count({ where }),
        ]);

        return {
            items: items.map((e: any) => ({
                id: e.id,
                cashRegisterId: e.cashRegisterId,
                category: e.category,
                amount: Number(e.amount),
                description: e.description,
                paymentMethod: e.paymentMethod,
                createdById: e.createdById,
                createdAt: e.createdAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
