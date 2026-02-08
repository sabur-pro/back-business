import { IWarehouseRepository } from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
export declare class GetWarehousesUseCase {
    private readonly warehouseRepository;
    constructor(warehouseRepository: IWarehouseRepository);
    execute(userId: string): Promise<WarehouseEntity[]>;
    executeByPointId(pointId: string): Promise<WarehouseEntity[]>;
}
