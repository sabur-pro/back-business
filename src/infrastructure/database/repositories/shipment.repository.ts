import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IShipmentRepository,
    CreateShipmentData,
    ShipmentSearchParams,
    PaginatedShipments,
} from '@domain/repositories/shipment.repository.interface';
import { ShipmentEntity, ShipmentStatus } from '@domain/entities/shipment.entity';
import { ShipmentItemEntity } from '@domain/entities/shipment-item.entity';

const INCLUDE_RELATIONS = {
    items: true,
    fromAccount: { select: { id: true, name: true } },
    toAccount: { select: { id: true, name: true } },
    fromPoint: { select: { id: true, name: true } },
    toPoint: { select: { id: true, name: true } },
    fromWarehouse: { select: { id: true, name: true } },
    toWarehouse: { select: { id: true, name: true } },
};

@Injectable()
export class ShipmentRepository implements IShipmentRepository {
    constructor(private readonly prisma: PrismaService) { }

    private toItemEntity(item: any): ShipmentItemEntity {
        return ShipmentItemEntity.create({
            id: item.id,
            transferId: item.transferId,
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
        });
    }

    private toEntity(transfer: any): ShipmentEntity {
        return ShipmentEntity.create({
            id: transfer.id,
            number: transfer.number,
            fromAccountId: transfer.fromAccountId,
            toAccountId: transfer.toAccountId,
            fromPointId: transfer.fromPointId,
            toPointId: transfer.toPointId,
            fromWarehouseId: transfer.fromWarehouseId,
            toWarehouseId: transfer.toWarehouseId,
            totalYuan: transfer.totalYuan,
            totalRub: transfer.totalRub,
            waybillPhoto: transfer.waybillPhoto,
            transportPhoto: transfer.transportPhoto,
            receiverWaybillPhoto: transfer.receiverWaybillPhoto,
            status: transfer.status as ShipmentStatus,
            note: transfer.note,
            sentAt: transfer.sentAt,
            receivedAt: transfer.receivedAt,
            confirmedAt: transfer.confirmedAt,
            createdAt: transfer.createdAt,
            updatedAt: transfer.updatedAt,
            items: transfer.items?.map((i: any) => this.toItemEntity(i)) ?? [],
            fromAccountName: transfer.fromAccount?.name,
            toAccountName: transfer.toAccount?.name,
            fromPointName: transfer.fromPoint?.name,
            toPointName: transfer.toPoint?.name,
            fromWarehouseName: transfer.fromWarehouse?.name,
            toWarehouseName: transfer.toWarehouse?.name,
        });
    }

    async findById(id: string): Promise<ShipmentEntity | null> {
        const transfer = await this.prisma.transfer.findUnique({
            where: { id },
            include: INCLUDE_RELATIONS,
        });

        if (!transfer) return null;
        return this.toEntity(transfer);
    }

    async findByAccountOutgoing(
        accountId: string,
        params: ShipmentSearchParams,
    ): Promise<PaginatedShipments> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { fromAccountId: accountId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.transfer.findMany({
                where,
                include: INCLUDE_RELATIONS,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transfer.count({ where }),
        ]);

        return {
            items: items.map((t) => this.toEntity(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findByAccountIncoming(
        accountId: string,
        params: ShipmentSearchParams,
    ): Promise<PaginatedShipments> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { toAccountId: accountId };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.transfer.findMany({
                where,
                include: INCLUDE_RELATIONS,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transfer.count({ where }),
        ]);

        return {
            items: items.map((t) => this.toEntity(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findByPointIds(
        pointIds: string[],
        params: ShipmentSearchParams,
    ): Promise<PaginatedShipments> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = {
            OR: [
                { fromPointId: { in: pointIds } },
                { toPointId: { in: pointIds } },
            ],
        };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.transfer.findMany({
                where,
                include: INCLUDE_RELATIONS,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transfer.count({ where }),
        ]);

        return {
            items: items.map((t) => this.toEntity(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findByAccountIds(
        accountIds: string[],
        params: ShipmentSearchParams,
    ): Promise<PaginatedShipments> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = {
            OR: [
                { fromAccountId: { in: accountIds } },
                { toAccountId: { in: accountIds } },
            ],
        };
        if (params.status) {
            where.status = params.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.transfer.findMany({
                where,
                include: INCLUDE_RELATIONS,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transfer.count({ where }),
        ]);

        return {
            items: items.map((t) => this.toEntity(t)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async create(data: CreateShipmentData): Promise<ShipmentEntity> {
        const transfer = await this.prisma.transfer.create({
            data: {
                number: data.number,
                fromAccountId: data.fromAccountId,
                toAccountId: data.toAccountId,
                fromPointId: data.fromPointId,
                toPointId: data.toPointId,
                fromWarehouseId: data.fromWarehouseId,
                toWarehouseId: data.toWarehouseId,
                totalYuan: data.totalYuan,
                totalRub: data.totalRub,
                waybillPhoto: data.waybillPhoto,
                transportPhoto: data.transportPhoto,
                note: data.note,
                status: 'SENT',
                sentAt: data.sentAt ?? new Date(),
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
                    })),
                },
            },
            include: INCLUDE_RELATIONS,
        });

        return this.toEntity(transfer);
    }

    async updateStatus(
        id: string,
        status: string,
        data?: {
            receiverWaybillPhoto?: string;
            receivedAt?: Date;
            confirmedAt?: Date;
        },
    ): Promise<ShipmentEntity> {
        const transfer = await this.prisma.transfer.update({
            where: { id },
            data: {
                status: status as any,
                receiverWaybillPhoto: data?.receiverWaybillPhoto,
                receivedAt: data?.receivedAt,
                confirmedAt: data?.confirmedAt,
            },
            include: INCLUDE_RELATIONS,
        });

        return this.toEntity(transfer);
    }

    async generateNumber(): Promise<string> {
        const now = new Date();
        const prefix = `SH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

        const lastTransfer = await this.prisma.transfer.findFirst({
            where: {
                number: { startsWith: prefix },
            },
            orderBy: { number: 'desc' },
        });

        let seq = 1;
        if (lastTransfer) {
            const lastSeq = parseInt(lastTransfer.number.slice(prefix.length), 10);
            if (!isNaN(lastSeq)) {
                seq = lastSeq + 1;
            }
        }

        return `${prefix}${String(seq).padStart(4, '0')}`;
    }
}
