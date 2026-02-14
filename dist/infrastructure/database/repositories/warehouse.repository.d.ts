import { PrismaService } from '../prisma/prisma.service';
import { IWarehouseRepository, CreateWarehouseData, UpdateWarehouseData } from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity, WarehouseType } from '@domain/entities/warehouse.entity';
export declare class WarehouseRepository implements IWarehouseRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<WarehouseEntity | null>;
    findByPointId(pointId: string): Promise<WarehouseEntity[]>;
    findByPointIdAndType(pointId: string, type: WarehouseType): Promise<WarehouseEntity[]>;
    findByPointIdAndName(pointId: string, name: string): Promise<WarehouseEntity | null>;
    findByUserId(userId: string): Promise<WarehouseEntity[]>;
    findByUserIdAndType(userId: string, type: WarehouseType): Promise<WarehouseEntity[]>;
    create(data: CreateWarehouseData): Promise<WarehouseEntity>;
    update(id: string, data: UpdateWarehouseData): Promise<WarehouseEntity>;
    delete(id: string): Promise<void>;
    private mapToEntity;
}
