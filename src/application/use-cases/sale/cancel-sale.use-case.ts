import {
    Inject,
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    ISaleRepository,
    SALE_REPOSITORY,
} from '@domain/repositories/sale.repository.interface';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import { SaleEntity, SaleStatus, PaymentMethod } from '@domain/entities/sale.entity';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class CancelSaleUseCase {
    constructor(
        @Inject(SALE_REPOSITORY)
        private readonly saleRepository: ISaleRepository,
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(saleId: string): Promise<SaleEntity> {
        const sale = await this.saleRepository.findById(saleId);
        if (!sale) {
            throw new NotFoundException('Продажа не найдена');
        }

        if (sale.status === SaleStatus.CANCELLED) {
            throw new BadRequestException('Продажа уже отменена');
        }

        // Return products to shop in a transaction
        await this.prisma.$transaction(async (tx) => {
            for (const item of sale.items) {
                if (!item.productId) continue;

                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (product) {
                    const newBoxCount = product.boxCount + item.boxCount;
                    const newPairCount = product.pairCount + item.pairCount;
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
            }

            await tx.sale.update({
                where: { id: saleId },
                data: { status: 'CANCELLED' },
            });
        });

        // Reverse client counterparty balance if sale had a client
        if (sale.clientId) {
            // Reverse GOODS_SOLD: decrease client debt by totalActual
            await this.counterpartyRepository.createTransaction({
                counterpartyId: sale.clientId,
                type: CounterpartyTransactionType.GOODS_SOLD,
                amount: -sale.totalActual,
                description: `Отмена продажи ${sale.number}`,
                relatedId: sale.id,
            });
            await this.counterpartyRepository.updateBalance(sale.clientId, -sale.totalActual);

            // Reverse PAYMENT_IN: restore client debt by paidAmount
            if (sale.paidAmount > 0) {
                await this.counterpartyRepository.createTransaction({
                    counterpartyId: sale.clientId,
                    type: CounterpartyTransactionType.PAYMENT_IN,
                    amount: -sale.paidAmount,
                    description: `Отмена оплаты по продаже ${sale.number}`,
                    relatedId: sale.id,
                });
                await this.counterpartyRepository.updateBalance(sale.clientId, sale.paidAmount);
            }
        }

        // Reverse cash register balance — reverse cash and card separately
        const register = await this.cashRegisterRepository.findByShopId(sale.shopId);
        if (register) {
            const saleCashAmount = Number(sale.cashAmount ?? 0);
            const saleCardAmount = Number(sale.cardAmount ?? 0);

            if (saleCashAmount > 0) {
                await this.cashRegisterRepository.createTransaction({
                    cashRegisterId: register.id,
                    type: CashTransactionType.SALE_INCOME,
                    amount: -saleCashAmount,
                    description: `Отмена продажи ${sale.number} (наличные)`,
                    relatedId: sale.id,
                });
                await this.cashRegisterRepository.updateBalance(register.id, -saleCashAmount);
            }

            if (saleCardAmount > 0) {
                await this.cashRegisterRepository.createTransaction({
                    cashRegisterId: register.id,
                    type: CashTransactionType.SALE_INCOME_CARD,
                    amount: -saleCardAmount,
                    description: `Отмена продажи ${sale.number} (карта)`,
                    relatedId: sale.id,
                });
                await this.cashRegisterRepository.updateCardBalance(register.id, -saleCardAmount);
            }
        }

        return this.saleRepository.findById(saleId) as Promise<SaleEntity>;
    }
}
