import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IAccountRepository,
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import { UserRole } from '@domain/entities/user.entity';

export interface TrackingProduct {
    id: string;
    sku: string;
    photo: string | null;
    photoOriginal: string | null;
    sizeRange: string | null;
    boxCount: number;
    pairCount: number;
    priceYuan: number;
    priceRub: number;
    totalYuan: number;
    totalRub: number;
    warehouseId: string | null;
    warehouseName: string | null;
    warehouseType: string | null;
    pointName: string | null;
    isActive: boolean;
    createdAt: Date;
}

export interface TrackingReceipt {
    id: string;
    receiptNumber: string;
    receiptId: string;
    pointName: string;
    warehouseId: string;
    supplierName: string | null;
    quantity: number;
    costPrice: number;
    salePrice: number;
    totalAmount: number;
    status: string;
    createdAt: Date;
}

export interface TrackingTransfer {
    id: string;
    transferNumber: string;
    transferId: string;
    fromPointName: string;
    toPointName: string;
    fromWarehouseName: string | null;
    toWarehouseName: string | null;
    boxCount: number;
    pairCount: number;
    priceYuan: number;
    priceRub: number;
    totalYuan: number;
    totalRub: number;
    status: string;
    sentAt: Date | null;
    receivedAt: Date | null;
    createdAt: Date;
}

export interface TrackingSale {
    id: string;
    saleNumber: string;
    saleId: string;
    shopName: string;
    pointName: string;
    boxCount: number;
    pairCount: number;
    priceRub: number;
    actualSalePrice: number;
    totalActual: number;
    profit: number;
    status: string;
    createdAt: Date;
}

export interface TrackingStock {
    warehouseId: string;
    warehouseName: string;
    warehouseType: string;
    pointName: string;
    productId: string;
    quantity: number;
    boxCount: number;
    pairCount: number;
}

export interface TrackingTimelineEvent {
    type: 'RECEIPT' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'SALE' | 'CREATED' | 'UPDATED' | 'DELETED';
    date: Date;
    description: string;
    pointName: string | null;
    warehouseName: string | null;
    boxCount: number | null;
    pairCount: number | null;
    details: Record<string, any>;
}

export interface ProductTrackingResponse {
    products: TrackingProduct[];
    receipts: TrackingReceipt[];
    transfers: TrackingTransfer[];
    sales: TrackingSale[];
    currentStock: TrackingStock[];
    timeline: TrackingTimelineEvent[];
}

@Injectable()
export class TrackProductUseCase {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(userId: string, sku: string): Promise<ProductTrackingResponse> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Get user's account IDs
        const accountIds: string[] = [];
        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(userId);
            accountIds.push(...accounts.map((a) => a.id));
        } else if (user.accountId) {
            accountIds.push(user.accountId);
        }

        if (accountIds.length === 0) {
            return { products: [], receipts: [], transfers: [], sales: [], currentStock: [], timeline: [] };
        }

        // Find all products with this SKU in user's accounts
        const products = await this.prisma.product.findMany({
            where: {
                sku: { contains: sku, mode: 'insensitive' },
                accountId: { in: accountIds },
            },
            include: {
                warehouse: {
                    include: {
                        point: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const productIds = products.map(p => p.id);

        if (productIds.length === 0) {
            return { products: [], receipts: [], transfers: [], sales: [], currentStock: [], timeline: [] };
        }

        // Query all related data in parallel
        const [receipts, transfers, sales, auditLogs] = await Promise.all([
            // Goods receipts
            this.prisma.goodsReceiptItem.findMany({
                where: { productId: { in: productIds } },
                include: {
                    goodsReceipt: {
                        include: {
                            point: true,
                            supplier: true,
                        },
                    },
                },
                orderBy: { goodsReceipt: { createdAt: 'desc' } },
            }),
            // Transfers (both items linked by productId and by SKU for historical)
            this.prisma.transferItem.findMany({
                where: {
                    OR: [
                        { productId: { in: productIds } },
                        { sku: { contains: sku, mode: 'insensitive' } },
                    ],
                    transfer: {
                        OR: [
                            { fromAccountId: { in: accountIds } },
                            { toAccountId: { in: accountIds } },
                        ],
                    },
                },
                include: {
                    transfer: {
                        include: {
                            fromPoint: true,
                            toPoint: true,
                            fromWarehouse: true,
                            toWarehouse: true,
                        },
                    },
                },
                orderBy: { transfer: { createdAt: 'desc' } },
            }),
            // Sales
            this.prisma.saleItem.findMany({
                where: {
                    OR: [
                        { productId: { in: productIds } },
                        { sku: { contains: sku, mode: 'insensitive' } },
                    ],
                    sale: { accountId: { in: accountIds } },
                },
                include: {
                    sale: {
                        include: {
                            shop: true,
                            point: true,
                        },
                    },
                },
                orderBy: { sale: { createdAt: 'desc' } },
            }),
            // Audit logs
            this.prisma.auditLog.findMany({
                where: {
                    entityType: 'PRODUCT',
                    entityId: { in: productIds },
                    accountId: { in: accountIds },
                },
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        // Map products
        const mappedProducts: TrackingProduct[] = products.map(p => ({
            id: p.id,
            sku: p.sku,
            photo: p.photo,
            photoOriginal: p.photoOriginal,
            sizeRange: p.sizeRange,
            boxCount: p.boxCount,
            pairCount: p.pairCount,
            priceYuan: Number(p.priceYuan),
            priceRub: Number(p.priceRub),
            totalYuan: Number(p.totalYuan),
            totalRub: Number(p.totalRub),
            warehouseId: p.warehouseId,
            warehouseName: p.warehouse?.name || null,
            warehouseType: p.warehouse?.type || null,
            pointName: p.warehouse?.point?.name || null,
            isActive: p.isActive,
            createdAt: p.createdAt,
        }));

        // Map receipts
        const mappedReceipts: TrackingReceipt[] = receipts.map(r => ({
            id: r.id,
            receiptNumber: r.goodsReceipt.number,
            receiptId: r.goodsReceiptId,
            pointName: r.goodsReceipt.point.name,
            warehouseId: r.goodsReceipt.warehouseId,
            supplierName: r.goodsReceipt.supplier?.name || r.goodsReceipt.supplierName || null,
            quantity: Number(r.quantity),
            costPrice: Number(r.costPrice),
            salePrice: Number(r.salePrice),
            totalAmount: Number(r.totalAmount),
            status: r.goodsReceipt.status,
            createdAt: r.goodsReceipt.createdAt,
        }));

        // Map transfers — deduplicate by transferId
        const seenTransferIds = new Set<string>();
        const mappedTransfers: TrackingTransfer[] = [];
        for (const t of transfers) {
            if (seenTransferIds.has(t.transferId)) continue;
            seenTransferIds.add(t.transferId);
            mappedTransfers.push({
                id: t.id,
                transferNumber: t.transfer.number,
                transferId: t.transferId,
                fromPointName: t.transfer.fromPoint.name,
                toPointName: t.transfer.toPoint.name,
                fromWarehouseName: t.transfer.fromWarehouse?.name || null,
                toWarehouseName: t.transfer.toWarehouse?.name || null,
                boxCount: t.boxCount,
                pairCount: t.pairCount,
                priceYuan: Number(t.priceYuan),
                priceRub: Number(t.priceRub),
                totalYuan: Number(t.totalYuan),
                totalRub: Number(t.totalRub),
                status: t.transfer.status,
                sentAt: t.transfer.sentAt,
                receivedAt: t.transfer.receivedAt,
                createdAt: t.transfer.createdAt,
            });
        }

        // Map sales — deduplicate by saleId
        const seenSaleIds = new Set<string>();
        const mappedSales: TrackingSale[] = [];
        for (const s of sales) {
            if (seenSaleIds.has(s.saleId)) continue;
            seenSaleIds.add(s.saleId);
            mappedSales.push({
                id: s.id,
                saleNumber: s.sale.number,
                saleId: s.saleId,
                shopName: s.sale.shop.name,
                pointName: s.sale.point.name,
                boxCount: s.boxCount,
                pairCount: s.pairCount,
                priceRub: Number(s.priceRub),
                actualSalePrice: Number(s.actualSalePrice),
                totalActual: Number(s.totalActual),
                profit: Number(s.profit),
                status: s.sale.status,
                createdAt: s.sale.createdAt,
            });
        }

        // Build current stock from Product records directly
        // Each Product record is a stock entry (sku + warehouseId + boxCount/pairCount)
        const mappedStocks: TrackingStock[] = products
            .filter(p => p.isActive && !p.deletedAt && p.warehouse && (p.boxCount > 0 || p.pairCount > 0))
            .map(p => ({
                warehouseId: p.warehouseId || '',
                warehouseName: p.warehouse!.name,
                warehouseType: p.warehouse!.type,
                pointName: p.warehouse!.point?.name || '',
                productId: p.id,
                quantity: p.pairCount,
                boxCount: p.boxCount,
                pairCount: p.pairCount,
            }));

        // Build timeline
        const timeline: TrackingTimelineEvent[] = [];

        // Receipt events
        for (const r of mappedReceipts) {
            timeline.push({
                type: 'RECEIPT',
                date: r.createdAt,
                description: `Приход ${r.receiptNumber}${r.supplierName ? ` от ${r.supplierName}` : ''}`,
                pointName: r.pointName,
                warehouseName: null,
                boxCount: null,
                pairCount: Math.round(r.quantity),
                details: { receiptNumber: r.receiptNumber, totalAmount: r.totalAmount },
            });
        }

        // Transfer events
        for (const t of mappedTransfers) {
            timeline.push({
                type: 'TRANSFER_OUT',
                date: t.createdAt,
                description: `Отправка ${t.transferNumber}: ${t.fromPointName} → ${t.toPointName}`,
                pointName: t.fromPointName,
                warehouseName: t.fromWarehouseName,
                boxCount: t.boxCount,
                pairCount: t.pairCount,
                details: {
                    transferNumber: t.transferNumber,
                    status: t.status,
                    toPointName: t.toPointName,
                    toWarehouseName: t.toWarehouseName,
                },
            });
            if (t.receivedAt) {
                timeline.push({
                    type: 'TRANSFER_IN',
                    date: t.receivedAt,
                    description: `Приёмка ${t.transferNumber}: ${t.toPointName}`,
                    pointName: t.toPointName,
                    warehouseName: t.toWarehouseName,
                    boxCount: t.boxCount,
                    pairCount: t.pairCount,
                    details: {
                        transferNumber: t.transferNumber,
                        status: t.status,
                        fromPointName: t.fromPointName,
                    },
                });
            }
        }

        // Sale events
        for (const s of mappedSales) {
            timeline.push({
                type: 'SALE',
                date: s.createdAt,
                description: `Продажа ${s.saleNumber} в ${s.shopName}`,
                pointName: s.pointName,
                warehouseName: s.shopName,
                boxCount: s.boxCount,
                pairCount: s.pairCount,
                details: {
                    saleNumber: s.saleNumber,
                    totalActual: s.totalActual,
                    profit: s.profit,
                    status: s.status,
                },
            });
        }

        // Audit log events (created/updated/deleted)
        for (const log of auditLogs) {
            const nd = (log.newData as Record<string, any>) || {};
            const od = (log.oldData as Record<string, any>) || {};
            const meta = (log.metadata as Record<string, any>) || {};

            if (log.action === 'PRODUCT_CREATED' || log.action === 'PRODUCT_BATCH_CREATED') {
                timeline.push({
                    type: 'CREATED',
                    date: log.createdAt,
                    description: `Товар создан (${nd.sku || sku})`,
                    pointName: meta.pointName || null,
                    warehouseName: null,
                    boxCount: nd.boxCount || null,
                    pairCount: nd.pairCount || null,
                    details: { userName: `${log.user.firstName} ${log.user.lastName}`, ...nd },
                });
            } else if (log.action === 'PRODUCT_UPDATED') {
                timeline.push({
                    type: 'UPDATED',
                    date: log.createdAt,
                    description: `Товар изменён`,
                    pointName: meta.pointName || null,
                    warehouseName: null,
                    boxCount: null,
                    pairCount: null,
                    details: { userName: `${log.user.firstName} ${log.user.lastName}`, oldData: od, newData: nd },
                });
            } else if (log.action === 'PRODUCT_DELETED') {
                timeline.push({
                    type: 'DELETED',
                    date: log.createdAt,
                    description: `Товар удалён`,
                    pointName: meta.pointName || null,
                    warehouseName: null,
                    boxCount: od.boxCount || null,
                    pairCount: od.pairCount || null,
                    details: { userName: `${log.user.firstName} ${log.user.lastName}`, ...od },
                });
            }
        }

        // Sort timeline by date ascending (oldest first)
        timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            products: mappedProducts,
            receipts: mappedReceipts,
            transfers: mappedTransfers,
            sales: mappedSales,
            currentStock: mappedStocks,
            timeline,
        };
    }
}
