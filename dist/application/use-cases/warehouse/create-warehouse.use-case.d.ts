import { IWarehouseRepository } from '@domain/repositories/warehouse.repository.interface';
import { IPointRepository } from '@domain/repositories/point.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
import { CreateWarehouseDto } from '@application/dto/warehouse';
export declare class CreateWarehouseUseCase {
    private readonly warehouseRepository;
    private readonly pointRepository;
    constructor(warehouseRepository: IWarehouseRepository, pointRepository: IPointRepository);
    execute(userId: string, dto: CreateWarehouseDto): Promise<WarehouseEntity>;
}
