import { PrismaService } from '../prisma/prisma.service';
import { IWarehouseRepository, CreateWarehouseData, UpdateWarehouseData } from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
export declare class WarehouseRepository implements IWarehouseRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<WarehouseEntity | null>;
    findByPointId(pointId: string): Promise<WarehouseEntity[]>;
    findByUserId(userId: string): Promise<WarehouseEntity[]>;
    create(data: CreateWarehouseData): Promise<WarehouseEntity>;
    update(id: string, data: UpdateWarehouseData): Promise<WarehouseEntity>;
    delete(id: string): Promise<void>;
}
