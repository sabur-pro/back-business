import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IProductArrivalRepository,
    CreateArrivalData,
    ArrivalDaySummary,
    ArrivalDayStatus,
    ApplyArrivalDeltaData,
} from '@domain/repositories/product-arrival.repository.interface';
import { ProductArrivalEntity, ArrivalSource } from '@domain/entities/product-arrival.entity';
import { ProductEntity } from '@domain/entities/product.entity';

@Injectable()
export class ProductArrivalRepository implements IProductArrivalRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createMany(data: CreateArrivalData[]): Promise<void> {
        if (data.length === 0) return;

        await this.prisma.productArrival.createMany({
            data: data.map((item) => ({
                accountId: item.accountId,
                warehouseId: item.warehouseId,
                productId: item.productId ?? null,
                sku: item.sku,
                photo: item.photo ?? null,
                sizeRange: item.sizeRange ?? null,
                boxCount: item.boxCount,
                pairCount: item.pairCount,
                priceYuan: item.priceYuan,
                priceRub: item.priceRub,
                recommendedSalePrice: item.recommendedSalePrice ?? 0,
                sourceType: item.sourceType,
                sourceId: item.sourceId ?? null,
                arrivedAt: item.arrivedAt,
            })),
        });
    }

    async findById(id: string): Promise<ProductArrivalEntity | null> {
        const record = await this.prisma.productArrival.findUnique({
            where: { id },
            include: { product: true },
        });

        return record ? this.mapToEntity(record) : null;
    }

    async findByWarehouseAndRange(
        warehouseId: string,
        from: Date,
        to: Date,
    ): Promise<ProductArrivalEntity[]> {
        const records = await this.prisma.productArrival.findMany({
            where: {
                warehouseId,
                arrivedAt: { gte: from, lt: to },
            },
            include: { product: true },
            orderBy: [{ arrivedAt: 'desc' }, { sku: 'asc' }],
        });

        return records.map((r) => this.mapToEntity(r));
    }

    async findRemaindersBefore(warehouseId: string, before: Date): Promise<ProductArrivalEntity[]> {
        // Остаток партии = пришло − продано − возвращено. Сравнение колонок между собой
        // Prisma не умеет, поэтому отбираем id сырым запросом.
        const rows = await this.prisma.$queryRaw<Array<{ id: string }>>`
            SELECT "id"
            FROM "ProductArrival"
            WHERE "warehouseId" = ${warehouseId}
              AND "arrivedAt" < ${before}
              AND (("pairCount" - "soldPairs" - "returnedPairs") > 0
                   OR ("boxCount" - "soldBoxes" - "returnedBoxes") > 0)
            ORDER BY "arrivedAt" DESC
        `;

        if (rows.length === 0) return [];

        const records = await this.prisma.productArrival.findMany({
            where: { id: { in: rows.map((r) => r.id) } },
            include: { product: true },
            orderBy: [{ arrivedAt: 'desc' }, { sku: 'asc' }],
        });

        // Товар мог быть удалён — такие партии в остатке не показываем
        return records
            .filter((r) => r.product && r.product.deletedAt === null)
            .map((r) => this.mapToEntity(r));
    }

    async getDaysSummary(
        warehouseId: string,
        from: Date,
        to: Date,
        tzOffsetMinutes: number,
    ): Promise<ArrivalDaySummary[]> {
        const rows = await this.prisma.$queryRaw<
            Array<{
                date: string;
                arrivalsCount: number;
                boxCount: number;
                pairCount: number;
                soldBoxes: number;
                soldPairs: number;
                returnedBoxes: number;
                returnedPairs: number;
                totalCostRub: number;
                totalRecommended: number;
            }>
        >`
            SELECT
                to_char("arrivedAt" + make_interval(mins => ${tzOffsetMinutes}::int), 'YYYY-MM-DD') AS "date",
                COUNT(*)::int AS "arrivalsCount",
                COALESCE(SUM("boxCount"), 0)::int AS "boxCount",
                COALESCE(SUM("pairCount"), 0)::int AS "pairCount",
                COALESCE(SUM("soldBoxes"), 0)::int AS "soldBoxes",
                COALESCE(SUM("soldPairs"), 0)::int AS "soldPairs",
                COALESCE(SUM("returnedBoxes"), 0)::int AS "returnedBoxes",
                COALESCE(SUM("returnedPairs"), 0)::int AS "returnedPairs",
                COALESCE(SUM("priceRub" * "pairCount"), 0)::float8 AS "totalCostRub",
                COALESCE(SUM("recommendedSalePrice" * "pairCount"), 0)::float8 AS "totalRecommended"
            FROM "ProductArrival"
            WHERE "warehouseId" = ${warehouseId}
              AND "arrivedAt" >= ${from}
              AND "arrivedAt" < ${to}
            GROUP BY 1
            ORDER BY 1 DESC
        `;

        return rows.map((row) => {
            const remainderBoxes = Math.max(0, row.boxCount - row.soldBoxes - row.returnedBoxes);
            const remainderPairs = Math.max(0, row.pairCount - row.soldPairs - row.returnedPairs);

            let status: ArrivalDayStatus = 'NEW';
            if (remainderPairs === 0 && remainderBoxes === 0) {
                status = 'DONE';
            } else if (row.soldPairs > 0 || row.soldBoxes > 0 || row.returnedPairs > 0 || row.returnedBoxes > 0) {
                status = 'PARTIAL';
            }

            return {
                date: row.date,
                arrivalsCount: row.arrivalsCount,
                boxCount: row.boxCount,
                pairCount: row.pairCount,
                soldBoxes: row.soldBoxes,
                soldPairs: row.soldPairs,
                returnedBoxes: row.returnedBoxes,
                returnedPairs: row.returnedPairs,
                remainderBoxes,
                remainderPairs,
                totalCostRub: Math.round(row.totalCostRub * 100) / 100,
                totalRecommended: Math.round(row.totalRecommended * 100) / 100,
                status,
            };
        });
    }

    async incrementSold(items: ApplyArrivalDeltaData[]): Promise<void> {
        await this.applyDelta(items, 'sold', 1);
    }

    async decrementSold(items: ApplyArrivalDeltaData[]): Promise<void> {
        await this.applyDelta(items, 'sold', -1);
    }

    async incrementReturned(items: ApplyArrivalDeltaData[]): Promise<void> {
        await this.applyDelta(items, 'returned', 1);
    }

    private async applyDelta(
        items: ApplyArrivalDeltaData[],
        field: 'sold' | 'returned',
        sign: 1 | -1,
    ): Promise<void> {
        if (items.length === 0) return;

        const boxField = field === 'sold' ? 'soldBoxes' : 'returnedBoxes';
        const pairField = field === 'sold' ? 'soldPairs' : 'returnedPairs';

        await this.prisma.$transaction(
            items.map((item) =>
                this.prisma.productArrival.update({
                    where: { id: item.id },
                    data: {
                        [boxField]: { increment: sign * item.boxCount },
                        [pairField]: { increment: sign * item.pairCount },
                    },
                }),
            ),
        );
    }

    private mapToEntity(record: any): ProductArrivalEntity {
        return ProductArrivalEntity.create({
            id: record.id,
            accountId: record.accountId,
            warehouseId: record.warehouseId,
            productId: record.productId,
            sku: record.sku,
            photo: record.photo,
            sizeRange: record.sizeRange,
            boxCount: record.boxCount,
            pairCount: record.pairCount,
            soldBoxes: record.soldBoxes,
            soldPairs: record.soldPairs,
            returnedBoxes: record.returnedBoxes,
            returnedPairs: record.returnedPairs,
            priceYuan: record.priceYuan,
            priceRub: record.priceRub,
            recommendedSalePrice: record.recommendedSalePrice,
            sourceType: record.sourceType as ArrivalSource,
            sourceId: record.sourceId,
            arrivedAt: record.arrivedAt,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            product: record.product
                ? ProductEntity.create({
                    id: record.product.id,
                    sku: record.product.sku,
                    photoOriginal: record.product.photoOriginal,
                    photo: record.product.photo,
                    sizeRange: record.product.sizeRange,
                    boxCount: record.product.boxCount,
                    pairCount: record.product.pairCount,
                    priceYuan: record.product.priceYuan,
                    priceRub: record.product.priceRub,
                    totalYuan: record.product.totalYuan,
                    totalRub: record.product.totalRub,
                    recommendedSalePrice: record.product.recommendedSalePrice,
                    totalRecommendedSale: record.product.totalRecommendedSale,
                    actualSalePrice: record.product.actualSalePrice,
                    totalActualSale: record.product.totalActualSale,
                    barcode: record.product.barcode,
                    accountId: record.product.accountId,
                    warehouseId: record.product.warehouseId,
                    isActive: record.product.isActive,
                    createdAt: record.product.createdAt,
                    updatedAt: record.product.updatedAt,
                })
                : null,
        });
    }
}
