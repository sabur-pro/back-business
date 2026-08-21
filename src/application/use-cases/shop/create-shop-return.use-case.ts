import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { CreateReturnDto, ReturnResponseDto } from '@application/dto/shop';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { dayRange } from './arrival-day.helper';

@Injectable()
export class CreateShopReturnUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, shopId: string, dto: CreateReturnDto): Promise<ReturnResponseDto> {
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }
        if (shop.type !== WarehouseType.SHOP) {
            throw new BadRequestException('Указанный объект не является магазином');
        }

        const userPoints = await this.pointRepository.findByUserId(userId);
        if (!userPoints.some((p) => p.id === shop.pointId)) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        const point = await this.pointRepository.findById(shop.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }
        const accountId = point.accountId;

        const items = dto.items.filter((item) => item.boxCount > 0 || item.pairCount > 0);
        if (items.length === 0) {
            throw new BadRequestException('Не указано количество для возврата');
        }

        const number = await this.generateNumber();
        const arrivalDate = dto.arrivalDate
            ? dayRange(dto.arrivalDate, dto.tzOffset ?? 0).from
            : null;

        const created = await this.prisma.$transaction(async (tx) => {
            let totalBoxes = 0;
            let totalPairs = 0;
            let totalYuan = 0;
            let totalRub = 0;

            const itemsData: any[] = [];

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) {
                    throw new NotFoundException(`Товар с ID "${item.productId}" не найден`);
                }
                if (product.accountId !== accountId) {
                    throw new ForbiddenException(`Товар "${product.sku}" не принадлежит аккаунту`);
                }
                if (product.warehouseId !== shopId) {
                    throw new BadRequestException(`Товар "${product.sku}" не находится в данном магазине`);
                }
                if (item.boxCount > product.boxCount) {
                    throw new BadRequestException(
                        `Недостаточно коробок товара "${product.sku}": к возврату ${item.boxCount}, в наличии ${product.boxCount}`,
                    );
                }
                if (item.pairCount > product.pairCount) {
                    throw new BadRequestException(
                        `Недостаточно пар товара "${product.sku}": к возврату ${item.pairCount}, в наличии ${product.pairCount}`,
                    );
                }

                if (item.arrivalId) {
                    const arrival = await tx.productArrival.findUnique({ where: { id: item.arrivalId } });
                    if (!arrival || arrival.warehouseId !== shopId) {
                        throw new NotFoundException(`Партия поступления не найдена: ${item.arrivalId}`);
                    }

                    const remainderBoxes = arrival.boxCount - arrival.soldBoxes - arrival.returnedBoxes;
                    const remainderPairs = arrival.pairCount - arrival.soldPairs - arrival.returnedPairs;
                    if (item.boxCount > remainderBoxes || item.pairCount > remainderPairs) {
                        throw new BadRequestException(
                            `Возврат по товару "${product.sku}" превышает остаток партии`,
                        );
                    }

                    await tx.productArrival.update({
                        where: { id: item.arrivalId },
                        data: {
                            returnedBoxes: { increment: item.boxCount },
                            returnedPairs: { increment: item.pairCount },
                        },
                    });
                }

                const newBoxCount = product.boxCount - item.boxCount;
                const newPairCount = product.pairCount - item.pairCount;

                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        boxCount: newBoxCount,
                        pairCount: newPairCount,
                        totalYuan: Math.round(Number(product.priceYuan) * newPairCount * 100) / 100,
                        totalRub: Math.round(Number(product.priceRub) * newPairCount * 100) / 100,
                        totalRecommendedSale: Number(product.recommendedSalePrice) * newPairCount,
                        totalActualSale: Number(product.actualSalePrice) * newPairCount,
                    },
                });

                const itemTotalYuan = Math.round(Number(product.priceYuan) * item.pairCount * 100) / 100;
                const itemTotalRub = Math.round(Number(product.priceRub) * item.pairCount * 100) / 100;

                totalBoxes += item.boxCount;
                totalPairs += item.pairCount;
                totalYuan += itemTotalYuan;
                totalRub += itemTotalRub;

                itemsData.push({
                    arrivalId: item.arrivalId ?? null,
                    productId: product.id,
                    sku: product.sku,
                    photo: product.photo,
                    sizeRange: product.sizeRange,
                    boxCount: item.boxCount,
                    pairCount: item.pairCount,
                    priceYuan: product.priceYuan,
                    priceRub: product.priceRub,
                    totalYuan: itemTotalYuan,
                    totalRub: itemTotalRub,
                });
            }

            return tx.productReturn.create({
                data: {
                    number,
                    accountId,
                    pointId: shop.pointId,
                    shopId,
                    arrivalDate,
                    totalBoxes,
                    totalPairs,
                    totalYuan: Math.round(totalYuan * 100) / 100,
                    totalRub: Math.round(totalRub * 100) / 100,
                    note: dto.note ?? null,
                    createdById: userId,
                    items: { create: itemsData },
                },
                include: { items: true },
            });
        });

        return this.toResponse(created);
    }

    private async generateNumber(): Promise<string> {
        const count = await this.prisma.productReturn.count();
        return `RET-${String(count + 1).padStart(6, '0')}`;
    }

    private toResponse(record: any): ReturnResponseDto {
        return {
            id: record.id,
            number: record.number,
            shopId: record.shopId,
            pointId: record.pointId,
            accountId: record.accountId,
            arrivalDate: record.arrivalDate,
            totalBoxes: record.totalBoxes,
            totalPairs: record.totalPairs,
            totalYuan: Number(record.totalYuan),
            totalRub: Number(record.totalRub),
            note: record.note,
            createdById: record.createdById,
            createdAt: record.createdAt,
            items: record.items.map((item: any) => ({
                id: item.id,
                arrivalId: item.arrivalId,
                productId: item.productId,
                sku: item.sku,
                photo: item.photo,
                sizeRange: item.sizeRange,
                boxCount: item.boxCount,
                pairCount: item.pairCount,
                priceYuan: Number(item.priceYuan),
                priceRub: Number(item.priceRub),
                totalYuan: Number(item.totalYuan),
                totalRub: Number(item.totalRub),
            })),
        };
    }
}
