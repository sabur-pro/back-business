import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
    IProductArrivalRepository,
    PRODUCT_ARRIVAL_REPOSITORY,
} from '@domain/repositories/product-arrival.repository.interface';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { ProductArrivalEntity } from '@domain/entities/product-arrival.entity';
import {
    ArrivalsQueryDto,
    ArrivalsResponseDto,
    ArrivalRowDto,
    ArrivalDaysQueryDto,
    ArrivalDayDto,
} from '@application/dto/shop';
import { dayRange, shiftDay, today } from './arrival-day.helper';

/** Сколько дней показывать в переключателе по умолчанию */
const DEFAULT_DAYS_RANGE = 60;

@Injectable()
export class GetShopArrivalsUseCase {
    constructor(
        @Inject(PRODUCT_ARRIVAL_REPOSITORY)
        private readonly arrivalRepository: IProductArrivalRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async executeDays(
        userId: string,
        shopId: string,
        query: ArrivalDaysQueryDto,
    ): Promise<ArrivalDayDto[]> {
        await this.checkAccess(userId, shopId);

        const tzOffset = query.tzOffset ?? 0;
        const to = query.to ?? today(tzOffset);
        const from = query.from ?? shiftDay(to, -DEFAULT_DAYS_RANGE);

        const { from: fromDate } = dayRange(from, tzOffset);
        const { to: toDate } = dayRange(to, tzOffset);

        return this.arrivalRepository.getDaysSummary(shopId, fromDate, toDate, tzOffset);
    }

    async executeByDate(
        userId: string,
        shopId: string,
        query: ArrivalsQueryDto,
    ): Promise<ArrivalsResponseDto> {
        await this.checkAccess(userId, shopId);

        const tzOffset = query.tzOffset ?? 0;
        const { from, to } = dayRange(query.date, tzOffset);

        const dayArrivals = await this.arrivalRepository.findByWarehouseAndRange(shopId, from, to);
        const remainders = query.includeRemainders
            ? await this.arrivalRepository.findRemaindersBefore(shopId, from)
            : [];

        // Остаток товара делится между всеми его партиями (FIFO — старые партии первыми),
        // чтобы сумма доступного к продаже не превышала фактический остаток на складе.
        const available = this.allocateStock([...remainders, ...dayArrivals]);

        const items = dayArrivals.map((a) => this.toRow(a, available));
        const remainderRows = remainders
            .map((a) => this.toRow(a, available))
            .filter((row) => row.availablePairs > 0 || row.availableBoxes > 0);

        return {
            date: query.date,
            shopId,
            items,
            remainders: remainderRows,
            totals: this.buildTotals(items),
        };
    }

    /**
     * Распределяет текущий остаток товара между его партиями:
     * старые партии получают остаток первыми.
     */
    private allocateStock(
        arrivals: ProductArrivalEntity[],
    ): Map<string, { boxes: number; pairs: number }> {
        const byProduct = new Map<string, ProductArrivalEntity[]>();
        for (const arrival of arrivals) {
            if (!arrival.productId) continue;
            const list = byProduct.get(arrival.productId) ?? [];
            list.push(arrival);
            byProduct.set(arrival.productId, list);
        }

        const result = new Map<string, { boxes: number; pairs: number }>();

        for (const list of byProduct.values()) {
            const sorted = [...list].sort((a, b) => a.arrivedAt.getTime() - b.arrivedAt.getTime());
            let boxesLeft = sorted[0].product?.boxCount ?? 0;
            let pairsLeft = sorted[0].product?.pairCount ?? 0;

            for (const arrival of sorted) {
                const boxes = Math.min(arrival.remainderBoxes, boxesLeft);
                const pairs = Math.min(arrival.remainderPairs, pairsLeft);
                boxesLeft -= boxes;
                pairsLeft -= pairs;
                result.set(arrival.id, { boxes, pairs });
            }
        }

        return result;
    }

    private toRow(
        arrival: ProductArrivalEntity,
        available: Map<string, { boxes: number; pairs: number }>,
    ): ArrivalRowDto {
        const stock = available.get(arrival.id) ?? { boxes: 0, pairs: 0 };

        return {
            id: arrival.id,
            productId: arrival.productId,
            sku: arrival.sku,
            photo: arrival.product?.photo ?? arrival.photo,
            sizeRange: arrival.product?.sizeRange ?? arrival.sizeRange,
            barcode: arrival.product?.barcode ?? null,
            arrivedAt: arrival.arrivedAt,
            boxCount: arrival.boxCount,
            pairCount: arrival.pairCount,
            soldBoxes: arrival.soldBoxes,
            soldPairs: arrival.soldPairs,
            returnedBoxes: arrival.returnedBoxes,
            returnedPairs: arrival.returnedPairs,
            availableBoxes: stock.boxes,
            availablePairs: stock.pairs,
            priceYuan: arrival.product?.priceYuan ?? arrival.priceYuan,
            priceRub: arrival.product?.priceRub ?? arrival.priceRub,
            recommendedSalePrice: arrival.product?.recommendedSalePrice ?? arrival.recommendedSalePrice,
            productBoxCount: arrival.product?.boxCount ?? 0,
            productPairCount: arrival.product?.pairCount ?? 0,
            sourceType: arrival.sourceType,
        };
    }

    private buildTotals(items: ArrivalRowDto[]) {
        const totals = items.reduce(
            (acc, item) => {
                acc.boxCount += item.boxCount;
                acc.pairCount += item.pairCount;
                acc.availableBoxes += item.availableBoxes;
                acc.availablePairs += item.availablePairs;
                acc.totalCostRub += item.priceRub * item.availablePairs;
                acc.totalRecommended += item.recommendedSalePrice * item.availablePairs;
                return acc;
            },
            {
                boxCount: 0,
                pairCount: 0,
                availableBoxes: 0,
                availablePairs: 0,
                totalCostRub: 0,
                totalRecommended: 0,
            },
        );

        totals.totalCostRub = Math.round(totals.totalCostRub * 100) / 100;
        totals.totalRecommended = Math.round(totals.totalRecommended * 100) / 100;
        return totals;
    }

    private async checkAccess(userId: string, shopId: string): Promise<void> {
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }

        const userPoints = await this.pointRepository.findByUserId(userId);
        if (!userPoints.some((p) => p.id === shop.pointId)) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }
    }
}
