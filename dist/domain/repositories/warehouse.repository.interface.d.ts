import { WarehouseEntity, WarehouseType } from '../entities/warehouse.entity';
export interface CreateWarehouseData {
    name: string;
    type?: WarehouseType;
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
export interface IWarehouseRepository {
    findById(id: string): Promise<WarehouseEntity | null>;
    findByPointId(pointId: string): Promise<WarehouseEntity[]>;
    findByPointIdAndType(pointId: string, type: WarehouseType): Promise<WarehouseEntity[]>;
    findByPointIdAndName(pointId: string, name: string): Promise<WarehouseEntity | null>;
    findByUserId(userId: string): Promise<WarehouseEntity[]>;
    findByUserIdAndType(userId: string, type: WarehouseType): Promise<WarehouseEntity[]>;
    create(data: CreateWarehouseData): Promise<WarehouseEntity>;
    update(id: string, data: UpdateWarehouseData): Promise<WarehouseEntity>;
    delete(id: string): Promise<void>;
}
export declare const WAREHOUSE_REPOSITORY: unique symbol;
