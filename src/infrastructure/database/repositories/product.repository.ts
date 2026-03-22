import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IProductRepository,
    CreateProductData,
    UpdateProductData,
    ProductSearchParams,
    PaginatedProducts,
    ProductStats,
} from '@domain/repositories/product.repository.interface';
import { ProductEntity } from '@domain/entities/product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    private toEntity(product: any): ProductEntity {
        return ProductEntity.create({
            id: product.id,
            sku: product.sku,
            photoOriginal: product.photoOriginal,
            photo: product.photo,
            sizeRange: product.sizeRange,
            boxCount: product.boxCount,
            pairCount: product.pairCount,
            priceYuan: product.priceYuan,
            priceRub: product.priceRub,
            totalYuan: product.totalYuan,
            totalRub: product.totalRub,
            recommendedSalePrice: product.recommendedSalePrice,
            totalRecommendedSale: product.totalRecommendedSale,
            actualSalePrice: product.actualSalePrice,
            totalActualSale: product.totalActualSale,
            barcode: product.barcode,
            accountId: product.accountId,
            warehouseId: product.warehouseId,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        });
    }

    async findById(id: string): Promise<ProductEntity | null> {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });

        if (!product) return null;

        return this.toEntity(product);
    }

    async findByAccountId(accountId: string): Promise<ProductEntity[]> {
        const products = await this.prisma.product.findMany({
            where: { accountId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });

        return products.map((p) => this.toEntity(p));
    }

    async findByAccountIdPaginated(
        accountId: string,
        params: ProductSearchParams,
    ): Promise<PaginatedProducts> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;
        const search = params.search?.trim();

        let where: any = { accountId, deletedAt: null };

        if (search) {
            // Build fuzzy-like search: split into tokens and match each across fields
            const tokens = search.split(/\s+/).filter(Boolean);
            const conditions = tokens.map((token) => {
                return {
                    OR: [
                        { sku: { contains: token, mode: 'insensitive' as const } },
                        { sizeRange: { contains: token, mode: 'insensitive' as const } },
                        { barcode: { contains: token, mode: 'insensitive' as const } },
                    ],
                };
            });
            where = { ...where, AND: conditions };
        }

        const [items, total, agg] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
            this.prisma.product.aggregate({
                where,
                _sum: { pairCount: true, boxCount: true },
            }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalPairs: Number(agg._sum.pairCount ?? 0),
            totalBoxes: Number(agg._sum.boxCount ?? 0),
        };
    }

    async findByWarehouseIdPaginated(
        warehouseId: string,
        params: ProductSearchParams,
    ): Promise<PaginatedProducts> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;
        const search = params.search?.trim();

        let where: any = { warehouseId, deletedAt: null };

        if (params.zeroBoxes) {
            where.boxCount = 0;
        }

        if (search) {
            const tokens = search.split(/\s+/).filter(Boolean);
            const conditions = tokens.map((token) => {
                return {
                    OR: [
                        { sku: { contains: token, mode: 'insensitive' as const } },
                        { sizeRange: { contains: token, mode: 'insensitive' as const } },
                        { barcode: { contains: token, mode: 'insensitive' as const } },
                    ],
                };
            });
            where = { ...where, AND: conditions };
        }

        const [items, total, agg] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
            this.prisma.product.aggregate({
                where,
                _sum: { pairCount: true, boxCount: true },
            }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalPairs: Number(agg._sum.pairCount ?? 0),
            totalBoxes: Number(agg._sum.boxCount ?? 0),
        };
    }

    async findByPointIdPaginated(
        pointId: string,
        params: ProductSearchParams,
    ): Promise<PaginatedProducts> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;
        const search = params.search?.trim();

        // Find all warehouse IDs for this point
        const warehouses = await this.prisma.warehouse.findMany({
            where: { pointId },
            select: { id: true },
        });
        const warehouseIds = warehouses.map((w) => w.id);

        let where: any = { warehouseId: { in: warehouseIds }, deletedAt: null };

        if (params.zeroBoxes) {
            where.boxCount = 0;
        }

        if (search) {
            const tokens = search.split(/\s+/).filter(Boolean);
            const conditions = tokens.map((token) => {
                return {
                    OR: [
                        { sku: { contains: token, mode: 'insensitive' as const } },
                        { sizeRange: { contains: token, mode: 'insensitive' as const } },
                        { barcode: { contains: token, mode: 'insensitive' as const } },
                    ],
                };
            });
            where = { ...where, AND: conditions };
        }

        const [items, total, agg] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
            this.prisma.product.aggregate({
                where,
                _sum: { pairCount: true, boxCount: true },
            }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalPairs: Number(agg._sum.pairCount ?? 0),
            totalBoxes: Number(agg._sum.boxCount ?? 0),
        };
    }

    async findBySkuAndAccountId(sku: string, accountId: string, warehouseId?: string | null): Promise<ProductEntity | null> {
        const where: any = { sku, accountId, deletedAt: null };
        if (warehouseId !== undefined) {
            where.warehouseId = warehouseId;
        }

        const product = await this.prisma.product.findFirst({ where });

        if (!product) return null;

        return this.toEntity(product);
    }

    async create(data: CreateProductData): Promise<ProductEntity> {
        const product = await this.prisma.product.create({
            data: {
                sku: data.sku,
                photoOriginal: data.photoOriginal,
                photo: data.photo,
                sizeRange: data.sizeRange,
                boxCount: data.boxCount ?? 0,
                pairCount: data.pairCount ?? 0,
                priceYuan: data.priceYuan,
                priceRub: data.priceRub,
                totalYuan: data.totalYuan,
                totalRub: data.totalRub,
                recommendedSalePrice: data.recommendedSalePrice ?? 0,
                totalRecommendedSale: data.totalRecommendedSale ?? 0,
                actualSalePrice: data.actualSalePrice ?? 0,
                totalActualSale: data.totalActualSale ?? 0,
                barcode: data.barcode,
                accountId: data.accountId,
                warehouseId: data.warehouseId,
                isActive: data.isActive ?? true,
            },
        });

        return this.toEntity(product);
    }

    async createMany(data: CreateProductData[]): Promise<ProductEntity[]> {
        const results: ProductEntity[] = [];

        await this.prisma.$transaction(async (tx) => {
            for (const item of data) {
                const product = await tx.product.create({
                    data: {
                        sku: item.sku,
                        photoOriginal: item.photoOriginal,
                        photo: item.photo,
                        sizeRange: item.sizeRange,
                        boxCount: item.boxCount ?? 0,
                        pairCount: item.pairCount ?? 0,
                        priceYuan: item.priceYuan,
                        priceRub: item.priceRub,
                        totalYuan: item.totalYuan,
                        totalRub: item.totalRub,
                        recommendedSalePrice: item.recommendedSalePrice ?? 0,
                        totalRecommendedSale: item.totalRecommendedSale ?? 0,
                        actualSalePrice: item.actualSalePrice ?? 0,
                        totalActualSale: item.totalActualSale ?? 0,
                        barcode: item.barcode,
                        accountId: item.accountId,
                        warehouseId: item.warehouseId,
                        isActive: item.isActive ?? true,
                    },
                });
                results.push(this.toEntity(product));
            }
        });

        return results;
    }

    async update(id: string, data: UpdateProductData): Promise<ProductEntity> {
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                sku: data.sku,
                photoOriginal: data.photoOriginal,
                photo: data.photo,
                sizeRange: data.sizeRange,
                boxCount: data.boxCount,
                pairCount: data.pairCount,
                priceYuan: data.priceYuan,
                priceRub: data.priceRub,
                totalYuan: data.totalYuan,
                totalRub: data.totalRub,
                recommendedSalePrice: data.recommendedSalePrice,
                totalRecommendedSale: data.totalRecommendedSale,
                actualSalePrice: data.actualSalePrice,
                totalActualSale: data.totalActualSale,
                barcode: data.barcode,
                isActive: data.isActive,
            },
        });

        return this.toEntity(product);
    }

    async updatePricesBySku(sku: string, accountId: string, data: { priceYuan?: number; priceRub?: number }): Promise<void> {
        if (data.priceYuan === undefined && data.priceRub === undefined) return;

        // 1. Update unit prices for all products with this SKU
        const priceUpdate: any = {};
        if (data.priceYuan !== undefined) priceUpdate.priceYuan = data.priceYuan;
        if (data.priceRub !== undefined) priceUpdate.priceRub = data.priceRub;

        if (Object.keys(priceUpdate).length > 0) {
            await this.prisma.product.updateMany({
                where: { sku, accountId, deletedAt: null },
                data: priceUpdate,
            });
        }

        // 2. Recalculate totals for each product individually based on its pairCount
        const products = await this.prisma.product.findMany({
            where: { sku, accountId, deletedAt: null },
            select: { id: true, pairCount: true, priceYuan: true, priceRub: true, recommendedSalePrice: true, actualSalePrice: true },
        });

        for (const product of products) {
            const pairCount = product.pairCount;
            await this.prisma.product.update({
                where: { id: product.id },
                data: {
                    totalYuan: Math.round(Number(product.priceYuan) * pairCount * 100) / 100,
                    totalRub: Math.round(Number(product.priceRub) * pairCount * 100) / 100,
                    totalRecommendedSale: Math.round(Number(product.recommendedSalePrice) * pairCount * 100) / 100,
                    totalActualSale: Math.round(Number(product.actualSalePrice) * pairCount * 100) / 100,
                },
            });
        }
    }

    async delete(id: string): Promise<void> {
        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async deleteMany(ids: string[]): Promise<number> {
        const result = await this.prisma.product.updateMany({
            where: { id: { in: ids } },
            data: { deletedAt: new Date() },
        });
        return result.count;
    }

    async restore(id: string): Promise<ProductEntity> {
        const product = await this.prisma.product.update({
            where: { id },
            data: { deletedAt: null },
        });
        return this.toEntity(product);
    }

    async getStatsByAccountIds(accountIds: string[]): Promise<ProductStats> {
        const where = { accountId: { in: accountIds }, isActive: true, deletedAt: null as any };

        const [productCount, uniqueSkuGroups, aggregation, inTransitAgg, warehouses] = await Promise.all([
            this.prisma.product.count({ where }),
            this.prisma.product.groupBy({ by: ['sku'], where }),
            this.prisma.product.aggregate({
                where,
                _sum: {
                    boxCount: true,
                    pairCount: true,
                    totalYuan: true,
                    totalRub: true,
                    totalRecommendedSale: true,
                },
            }),
            this.prisma.transferItem.aggregate({
                where: {
                    transfer: {
                        status: { in: ['PENDING', 'SENT'] },
                        fromAccountId: { in: accountIds },
                    },
                },
                _count: { id: true },
                _sum: { totalYuan: true, totalRub: true },
            }),
            // Get all warehouses for categorization
            this.prisma.warehouse.findMany({
                where: { point: { accountId: { in: accountIds } } },
                select: { id: true, pointId: true, type: true },
            }),
        ]);

        // Categorize points by warehouse types
        const pointTypes = new Map<string, Set<string>>();
        for (const wh of warehouses) {
            if (!pointTypes.has(wh.pointId)) pointTypes.set(wh.pointId, new Set());
            pointTypes.get(wh.pointId)!.add(wh.type);
        }

        // Categorize warehouse IDs
        const warehouseOnlyWhIds: string[] = [];
        const shopOnlyWhIds: string[] = [];
        const mixedWhIds: string[] = [];

        for (const wh of warehouses) {
            const types = pointTypes.get(wh.pointId)!;
            const hasWarehouse = types.has('WAREHOUSE');
            const hasShop = types.has('SHOP');
            if (hasWarehouse && hasShop) {
                mixedWhIds.push(wh.id);
            } else if (hasShop) {
                shopOnlyWhIds.push(wh.id);
            } else {
                warehouseOnlyWhIds.push(wh.id);
            }
        }

        // Aggregate per category
        const aggregateCategory = async (whIds: string[]) => {
            if (whIds.length === 0) return null;
            const catWhere = { ...where, warehouseId: { in: whIds } };
            const [count, agg] = await Promise.all([
                this.prisma.product.count({ where: catWhere }),
                this.prisma.product.aggregate({
                    where: catWhere,
                    _sum: { totalYuan: true, totalRub: true, totalRecommendedSale: true },
                }),
            ]);
            if (count === 0) return null;
            const catYuan = Number(agg._sum.totalYuan ?? 0);
            const catRub = Number(agg._sum.totalRub ?? 0);
            const catRec = Number(agg._sum.totalRecommendedSale ?? 0);
            return {
                totalProducts: count,
                totalYuan: catYuan,
                totalCostRub: catRub,
                totalRecommendedSale: catRec,
                differenceRubRecommended: catRec - catRub,
            };
        };

        const [warehouseOnlyCat, shopOnlyCat, mixedCat] = await Promise.all([
            aggregateCategory(warehouseOnlyWhIds),
            aggregateCategory(shopOnlyWhIds),
            aggregateCategory(mixedWhIds),
        ]);

        const totalYuan = Number(aggregation._sum.totalYuan ?? 0);
        const totalCostRub = Number(aggregation._sum.totalRub ?? 0);
        const totalRecommendedSale = Number(aggregation._sum.totalRecommendedSale ?? 0);
        const differenceRubRecommended = totalRecommendedSale - totalCostRub;

        return {
            totalProducts: productCount,
            uniqueProducts: uniqueSkuGroups.length,
            totalBoxes: Number(aggregation._sum.boxCount ?? 0),
            totalPairs: Number(aggregation._sum.pairCount ?? 0),
            totalYuan,
            totalCostRub,
            totalRecommendedSale,
            differenceRubRecommended,
            inTransitProducts: inTransitAgg._count.id,
            inTransitYuan: Number(inTransitAgg._sum.totalYuan ?? 0),
            inTransitRub: Number(inTransitAgg._sum.totalRub ?? 0),
            byCategory: {
                warehouseOnly: warehouseOnlyCat,
                shopOnly: shopOnlyCat,
                mixed: mixedCat,
            },
        };
    }

    async findAllByUserPaginated(
        accountIds: string[],
        params: ProductSearchParams,
    ): Promise<PaginatedProducts> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;
        const search = params.search?.trim();

        let where: any = { accountId: { in: accountIds }, deletedAt: null };

        if (search) {
            const tokens = search.split(/\s+/).filter(Boolean);
            const conditions = tokens.map((token) => {
                return {
                    OR: [
                        { sku: { contains: token, mode: 'insensitive' as const } },
                        { sizeRange: { contains: token, mode: 'insensitive' as const } },
                        { barcode: { contains: token, mode: 'insensitive' as const } },
                    ],
                };
            });
            where = { ...where, AND: conditions };
        }

        const [items, total, agg] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
            this.prisma.product.aggregate({
                where,
                _sum: { pairCount: true, boxCount: true },
            }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalPairs: Number(agg._sum.pairCount ?? 0),
            totalBoxes: Number(agg._sum.boxCount ?? 0),
        };
    }
}
