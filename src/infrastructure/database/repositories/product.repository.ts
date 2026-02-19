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
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) return null;

        return this.toEntity(product);
    }

    async findByAccountId(accountId: string): Promise<ProductEntity[]> {
        const products = await this.prisma.product.findMany({
            where: { accountId },
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

        let where: any = { accountId };

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

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
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

        let where: any = { warehouseId };

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

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
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

        let where: any = { warehouseId: { in: warehouseIds } };

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

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findBySkuAndAccountId(sku: string, accountId: string, warehouseId?: string | null): Promise<ProductEntity | null> {
        const where: any = { sku, accountId };
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

    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({
            where: { id },
        });
    }

    async deleteMany(ids: string[]): Promise<number> {
        const result = await this.prisma.product.deleteMany({
            where: { id: { in: ids } },
        });
        return result.count;
    }

    async getStatsByAccountIds(accountIds: string[]): Promise<ProductStats> {
        const where = { accountId: { in: accountIds } };

        const [uniqueSkus, aggregation] = await Promise.all([
            this.prisma.product.groupBy({
                by: ['sku'],
                where,
            }),
            this.prisma.product.aggregate({
                where,
                _sum: {
                    boxCount: true,
                    pairCount: true,
                },
            }),
        ]);

        return {
            uniqueProducts: uniqueSkus.length,
            totalBoxes: aggregation._sum.boxCount ?? 0,
            totalPairs: aggregation._sum.pairCount ?? 0,
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

        let where: any = { accountId: { in: accountIds } };

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

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            items: items.map((p) => this.toEntity(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
