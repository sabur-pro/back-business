import { ShipmentItemEntity } from './shipment-item.entity';

export enum ShipmentStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

export class ShipmentEntity {
    constructor(
        public readonly id: string,
        public readonly number: string,
        public readonly fromAccountId: string,
        public readonly toAccountId: string,
        public readonly fromPointId: string,
        public readonly toPointId: string,
        public readonly fromWarehouseId: string | null,
        public readonly toWarehouseId: string | null,
        public readonly totalYuan: number,
        public readonly totalRub: number,
        public readonly waybillPhoto: string | null,
        public readonly transportPhoto: string | null,
        public readonly receiverWaybillPhoto: string | null,
        public readonly status: ShipmentStatus,
        public readonly note: string | null,
        public readonly sentAt: Date | null,
        public readonly receivedAt: Date | null,
        public readonly confirmedAt: Date | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly items: ShipmentItemEntity[],
        public readonly fromAccountName?: string,
        public readonly toAccountName?: string,
        public readonly fromPointName?: string,
        public readonly toPointName?: string,
        public readonly fromWarehouseName?: string,
        public readonly toWarehouseName?: string,
    ) { }

    static create(props: {
        id: string;
        number: string;
        fromAccountId: string;
        toAccountId: string;
        fromPointId: string;
        toPointId: string;
        fromWarehouseId?: string | null;
        toWarehouseId?: string | null;
        totalYuan: number;
        totalRub: number;
        waybillPhoto?: string | null;
        transportPhoto?: string | null;
        receiverWaybillPhoto?: string | null;
        status?: ShipmentStatus;
        note?: string | null;
        sentAt?: Date | null;
        receivedAt?: Date | null;
        confirmedAt?: Date | null;
        createdAt?: Date;
        updatedAt?: Date;
        items?: ShipmentItemEntity[];
        fromAccountName?: string;
        toAccountName?: string;
        fromPointName?: string;
        toPointName?: string;
        fromWarehouseName?: string;
        toWarehouseName?: string;
    }): ShipmentEntity {
        return new ShipmentEntity(
            props.id,
            props.number,
            props.fromAccountId,
            props.toAccountId,
            props.fromPointId,
            props.toPointId,
            props.fromWarehouseId ?? null,
            props.toWarehouseId ?? null,
            Number(props.totalYuan),
            Number(props.totalRub),
            props.waybillPhoto ?? null,
            props.transportPhoto ?? null,
            props.receiverWaybillPhoto ?? null,
            props.status ?? ShipmentStatus.PENDING,
            props.note ?? null,
            props.sentAt ?? null,
            props.receivedAt ?? null,
            props.confirmedAt ?? null,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
            props.items ?? [],
            props.fromAccountName,
            props.toAccountName,
            props.fromPointName,
            props.toPointName,
            props.fromWarehouseName,
            props.toWarehouseName,
        );
    }
}
