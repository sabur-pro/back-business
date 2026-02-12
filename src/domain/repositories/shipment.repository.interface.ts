import { ShipmentEntity } from '../entities/shipment.entity';

export interface CreateShipmentData {
    number: string;
    fromAccountId: string;
    toAccountId: string;
    fromPointId: string;
    toPointId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    totalYuan: number;
    totalRub: number;
    waybillPhoto?: string | null;
    transportPhoto?: string | null;
    note?: string | null;
    sentAt?: Date;
    items: CreateShipmentItemData[];
}

export interface CreateShipmentItemData {
    productId: string;
    sku: string;
    photo?: string | null;
    sizeRange?: string | null;
    boxCount: number;
    pairCount: number;
    priceYuan: number;
    priceRub: number;
    totalYuan: number;
    totalRub: number;
}

export interface ShipmentSearchParams {
    page?: number;
    limit?: number;
    status?: string;
}

export interface PaginatedShipments {
    items: ShipmentEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IShipmentRepository {
    findById(id: string): Promise<ShipmentEntity | null>;
    findByAccountOutgoing(accountId: string, params: ShipmentSearchParams): Promise<PaginatedShipments>;
    findByAccountIncoming(accountId: string, params: ShipmentSearchParams): Promise<PaginatedShipments>;
    create(data: CreateShipmentData): Promise<ShipmentEntity>;
    updateStatus(id: string, status: string, data?: {
        receiverWaybillPhoto?: string;
        receivedAt?: Date;
        confirmedAt?: Date;
    }): Promise<ShipmentEntity>;
    generateNumber(): Promise<string>;
}

export const SHIPMENT_REPOSITORY = Symbol('IShipmentRepository');
