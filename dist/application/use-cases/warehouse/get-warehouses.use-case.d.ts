import { IWarehouseRepository } from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
export interface WarehouseWithStats {
    warehouse: WarehouseEntity;
    productCount: number;
    totalPairs: number;
    totalBoxes: number;
}
export declare class GetWarehousesUseCase {
    private readonly warehouseRepository;
    private readonly prisma;
    constructor(warehouseRepository: IWarehouseRepository, prisma: PrismaService);
    execute(userId: string): Promise<WarehouseEntity[]>;
    executeWithStats(userId: string): Promise<WarehouseWithStats[]>;
    executeById(id: string): Promise<WarehouseEntity | null>;
    executeByPointId(pointId: string): Promise<WarehouseEntity[]>;
    executeByPointIdWithStats(pointId: string): Promise<WarehouseWithStats[]>;
}
