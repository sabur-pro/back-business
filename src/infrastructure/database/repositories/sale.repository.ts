import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    ISaleRepository,
    CreateSaleData,
    SaleSearchParams,
    PaginatedSales,
} from '@domain/repositories/sale.repository.interface';
import { SaleEntity, SaleStatus, PaymentMethod } from '@domain/entities/sale.entity';
import { SaleItemEntity } from '@domain/entities/sale-item.entity';

@Injectable()
export class SaleRepository implements ISaleRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<SaleEntity | null> {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: true,
                shop: { select: { id: true, name: true } },
                point: { select: { id: true, name: true } },
                client: { select: { id: true, name: true } },
            },
        });

        if (!sale) return null;

        return this.mapToEntity(sale);
    }

    async findByShopId(shopId: string, params: SaleSearchParams): Promise<PaginatedSales> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { shopId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                include: {
                    items: true,
                    shop: { select: { id: true, name: true } },
                    point: { select: { id: true, name: true } },
                    client: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.sale.count({ where }),
        ]);

        return {
            items: items.map((s) => this.mapToEntity(s)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findByAccountId(accountId: string, params: SaleSearchParams): Promise<PaginatedSales> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { accountId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                include: {
                    items: true,
                    shop: { select: { id: true, name: true } },
                    point: { select: { id: true, name: true } },
                    client: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.sale.count({ where }),
        ]);

        return {
            items: items.map((s) => this.mapToEntity(s)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findByPointId(pointId: string, params: SaleSearchParams): Promise<PaginatedSales> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { pointId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                include: {
                    items: true,
                    shop: { select: { id: true, name: true } },
                    point: { select: { id: true, name: true } },
                    client: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.sale.count({ where }),
        ]);

        return {
            items: items.map((s) => this.mapToEntity(s)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async create(data: CreateSaleData): Promise<SaleEntity> {
        const sale = await this.prisma.sale.create({
            data: {
                number: data.number,
                pointId: data.pointId,
                shopId: data.shopId,
                accountId: data.accountId,
                clientId: data.clientId,
                totalYuan: data.totalYuan,
                totalRub: data.totalRub,
                totalRecommended: data.totalRecommended,
                totalActual: data.totalActual,
                paidAmount: data.paidAmount ?? 0,
                paymentMethod: (data.paymentMethod as any) ?? 'CASH',
                profit: data.profit,
                note: data.note,
                soldById: data.soldById,
                status: 'COMPLETED',
                items: {
                    create: data.items.map((item) => ({
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

        return this.mapToEntity(sale);
    }

    async updateStatus(id: string, status: string): Promise<SaleEntity> {
        const sale = await this.prisma.sale.update({
            where: { id },
            data: { status: status as any },
            include: {
                items: true,
                shop: { select: { id: true, name: true } },
                point: { select: { id: true, name: true } },
                client: { select: { id: true, name: true } },
            },
        });

        return this.mapToEntity(sale);
    }

    async generateNumber(): Promise<string> {
        const count = await this.prisma.sale.count();
        const num = count + 1;
        return `SAL-${String(num).padStart(6, '0')}`;
    }

    private mapToEntity(sale: any): SaleEntity {
        return SaleEntity.create({
            id: sale.id,
            number: sale.number,
            pointId: sale.pointId,
            shopId: sale.shopId,
            accountId: sale.accountId,
            clientId: sale.clientId,
            totalYuan: sale.totalYuan,
            totalRub: sale.totalRub,
            totalRecommended: sale.totalRecommended,
            totalActual: sale.totalActual,
            paidAmount: sale.paidAmount,
            cashAmount: sale.cashAmount,
            cardAmount: sale.cardAmount,
            paymentMethod: sale.paymentMethod as PaymentMethod,
            profit: sale.profit,
            status: sale.status as SaleStatus,
            note: sale.note,
            soldById: sale.soldById,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
            items: sale.items?.map((i: any) => SaleItemEntity.create({
                id: i.id,
                saleId: i.saleId,
                productId: i.productId,
                sku: i.sku,
                photo: i.photo,
                sizeRange: i.sizeRange,
                boxCount: i.boxCount,
                pairCount: i.pairCount,
                priceYuan: i.priceYuan,
                priceRub: i.priceRub,
                totalYuan: i.totalYuan,
                totalRub: i.totalRub,
                recommendedSalePrice: i.recommendedSalePrice,
                actualSalePrice: i.actualSalePrice,
                totalRecommended: i.totalRecommended,
                totalActual: i.totalActual,
                profit: i.profit,
            })) ?? [],
            shopName: sale.shop?.name,
            pointName: sale.point?.name,
            clientName: sale.client?.name,
        });
    }
}
