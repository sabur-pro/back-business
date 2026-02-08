import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
import { UpdateWarehouseDto } from '@application/dto/warehouse';

@Injectable()
export class UpdateWarehouseUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
    ) { }

    async execute(
        userId: string,
        warehouseId: string,
        dto: UpdateWarehouseDto,
    ): Promise<WarehouseEntity> {
        // Verify warehouse exists and user has access
        const userWarehouses = await this.warehouseRepository.findByUserId(userId);
        const hasAccess = userWarehouses.some((w) => w.id === warehouseId);

        if (!hasAccess) {
            const exists = await this.warehouseRepository.findById(warehouseId);
            if (!exists) {
                throw new NotFoundException('Склад не найден');
            }
            throw new ForbiddenException('Нет доступа к данному складу');
        }

        return this.warehouseRepository.update(warehouseId, {
            name: dto.name,
            address: dto.address,
            description: dto.description,
            isActive: dto.isActive,
        });
    }
}
