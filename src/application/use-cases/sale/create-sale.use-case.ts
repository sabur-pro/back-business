import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    ISaleRepository,
    SALE_REPOSITORY,
} from '@domain/repositories/sale.repository.interface';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
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
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { CounterpartyType } from '@domain/entities/counterparty.entity';
import { CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { SaleEntity, PaymentMethod } from '@domain/entities/sale.entity';
import { CreateSaleDto } from '@application/dto/sale';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class CreateSaleUseCase {
    constructor(
        @Inject(SALE_REPOSITORY)
        private readonly saleRepository: ISaleRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, dto: CreateSaleDto): Promise<SaleEntity> {
        // 1. Validate user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // 2. Validate shop exists and is type SHOP
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }
        if (shop.type !== WarehouseType.SHOP) {
            throw new BadRequestException('Указанный объект не является магазином');
        }

        // 3. Verify caller has access
        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === shop.pointId);
        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        // 4. Get point to determine accountId
        const point = await this.pointRepository.findById(shop.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }
        const accountId = point.accountId;

        // 5. Validate client if provided
        if (dto.clientId) {
            const client = await this.counterpartyRepository.findById(dto.clientId);
            if (!client) {
                throw new NotFoundException('Клиент не найден');
            }
            if (client.type !== CounterpartyType.CLIENT) {
                throw new BadRequestException('Указанный контрагент не является клиентом');
            }
        }

        // 6. Validate products and calculate totals
        let totalYuan = 0;
        let totalRub = 0;
        let totalRecommended = 0;
        let totalActual = 0;

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
            recommendedSalePrice: number;
            actualSalePrice: number;
            totalRecommended: number;
            totalActual: number;
            profit: number;
        }> = [];

        for (const item of dto.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new NotFoundException(`Товар с ID "${item.productId}" не найден`);
            }

            if (product.accountId !== accountId) {
                throw new ForbiddenException(`Товар "${product.sku}" не принадлежит аккаунту`);
            }

            if (product.warehouseId !== dto.shopId) {
                throw new BadRequestException(`Товар "${product.sku}" не находится в данном магазине`);
            }

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

            const itemTotalYuan = product.priceYuan * item.pairCount;
            const itemTotalRub = product.priceRub * item.pairCount;
            const itemTotalRecommended = product.recommendedSalePrice * item.pairCount;
            const itemTotalActual = item.actualSalePrice * item.pairCount;
            const itemProfit = itemTotalActual - itemTotalRub;

            totalYuan += itemTotalYuan;
            totalRub += itemTotalRub;
            totalRecommended += itemTotalRecommended;
            totalActual += itemTotalActual;

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
                recommendedSalePrice: product.recommendedSalePrice,
                actualSalePrice: item.actualSalePrice,
                totalRecommended: Math.round(itemTotalRecommended * 100) / 100,
                totalActual: Math.round(itemTotalActual * 100) / 100,
                profit: Math.round(itemProfit * 100) / 100,
            });
        }

        const totalProfit = Math.round((totalActual - totalRub) * 100) / 100;

        // 7. Generate sale number
        const number = await this.saleRepository.generateNumber();

        const paidAmount = dto.paidAmount ?? 0;
        const paymentMethod = (dto.paymentMethod as PaymentMethod) ?? PaymentMethod.CASH;

        // 8. Create sale and subtract stock in a transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Subtract products from shop
            for (const item of dto.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new NotFoundException(`Товар не найден: ${item.productId}`);
                }

                const newBoxCount = product.boxCount - item.boxCount;
                const newPairCount = product.pairCount - item.pairCount;
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

            // Create the sale record
            const sale = await tx.sale.create({
                data: {
                    number,
                    pointId: shop.pointId,
                    shopId: dto.shopId,
                    accountId,
                    clientId: dto.clientId ?? null,
                    paymentMethod: paymentMethod as any,
                    totalYuan: Math.round(totalYuan * 100) / 100,
                    totalRub: Math.round(totalRub * 100) / 100,
                    totalRecommended: Math.round(totalRecommended * 100) / 100,
                    totalActual: Math.round(totalActual * 100) / 100,
                    paidAmount,
                    profit: totalProfit,
                    note: dto.note,
                    soldById: userId,
                    status: 'COMPLETED',
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
                            recommendedSalePrice: item.recommendedSalePrice,
                            actualSalePrice: item.actualSalePrice,
                            totalRecommended: item.totalRecommended,
                            totalActual: item.totalActual,
                            profit: item.profit,
                        })),
                    },
                },
                include: {
                    items: true,
                    shop: { select: { id: true, name: true } },
                    point: { select: { id: true, name: true } },
                    client: { select: { id: true, name: true } },
                },
            });

            return sale;
        });

        // 9. Update client counterparty balance if client specified
        const roundedTotalActual = Math.round(totalActual * 100) / 100;
        if (dto.clientId) {
            // Record goods sold to client
            await this.counterpartyRepository.createTransaction({
                counterpartyId: dto.clientId,
                type: CounterpartyTransactionType.GOODS_SOLD,
                amount: roundedTotalActual,
                description: `Продажа ${number}`,
                relatedId: result.id,
            });
            await this.counterpartyRepository.updateBalance(dto.clientId, roundedTotalActual);

            // Record payment if any
            if (paidAmount > 0) {
                await this.counterpartyRepository.createTransaction({
                    counterpartyId: dto.clientId,
                    type: CounterpartyTransactionType.PAYMENT_IN,
                    amount: paidAmount,
                    description: `Оплата по продаже ${number}`,
                    relatedId: result.id,
                });
                await this.counterpartyRepository.updateBalance(dto.clientId, -paidAmount);
            }
        }

        // 10. Update cash register with sale income (paidAmount goes to cash or card balance)
        if (paidAmount > 0) {
            const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
            const txType = paymentMethod === PaymentMethod.CARD
                ? CashTransactionType.SALE_INCOME_CARD
                : CashTransactionType.SALE_INCOME;
            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: txType,
                amount: paidAmount,
                description: `Продажа ${number} (${paymentMethod === PaymentMethod.CARD ? 'карта' : 'наличные'})`,
                counterpartyId: dto.clientId ?? null,
                relatedId: result.id,
            });
            if (paymentMethod === PaymentMethod.CARD) {
                await this.cashRegisterRepository.updateCardBalance(register.id, paidAmount);
            } else {
                await this.cashRegisterRepository.updateBalance(register.id, paidAmount);
            }
        }

        return this.saleRepository.findById(result.id) as Promise<SaleEntity>;
    }
}
