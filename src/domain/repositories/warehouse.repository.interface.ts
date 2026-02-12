import { WarehouseEntity } from '../entities/warehouse.entity';

export interface CreateWarehouseData {
    name: string;
    pointId: string;
    address?: string | null;
    description?: string | null;
    isActive?: boolean;
}

export interface UpdateWarehouseData {
    name?: string;
    address?: string | null;
    description?: string | null;
    isActive?: boolean;
}

/**
 * Warehouse Repository Interface
 */
export interface IWarehouseRepository {
    findById(id: string): Promise<WarehouseEntity | null>;
    findByPointId(pointId: string): Promise<WarehouseEntity[]>;
    findByPointIdAndName(pointId: string, name: string): Promise<WarehouseEntity | null>;
    findByUserId(userId: string): Promise<WarehouseEntity[]>;
    create(data: CreateWarehouseData): Promise<WarehouseEntity>;
    update(id: string, data: UpdateWarehouseData): Promise<WarehouseEntity>;
    delete(id: string): Promise<void>;
}

export const WAREHOUSE_REPOSITORY = Symbol('IWarehouseRepository');
