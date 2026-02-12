import { Inject, Injectable } from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';

@Injectable()
export class GetWarehousesUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
    ) { }

    async execute(userId: string): Promise<WarehouseEntity[]> {
        return this.warehouseRepository.findByUserId(userId);
    }

    async executeById(id: string): Promise<WarehouseEntity | null> {
        return this.warehouseRepository.findById(id);
    }

    async executeByPointId(pointId: string): Promise<WarehouseEntity[]> {
        return this.warehouseRepository.findByPointId(pointId);
    }
}
