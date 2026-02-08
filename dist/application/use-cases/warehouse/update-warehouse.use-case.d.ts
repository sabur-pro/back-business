import { IWarehouseRepository } from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
import { UpdateWarehouseDto } from '@application/dto/warehouse';
export declare class UpdateWarehouseUseCase {
    private readonly warehouseRepository;
    constructor(warehouseRepository: IWarehouseRepository);
    execute(userId: string, warehouseId: string, dto: UpdateWarehouseDto): Promise<WarehouseEntity>;
}
