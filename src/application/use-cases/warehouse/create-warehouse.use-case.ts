import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
import { CreateWarehouseDto } from '@application/dto/warehouse';

@Injectable()
export class CreateWarehouseUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async execute(userId: string, dto: CreateWarehouseDto): Promise<WarehouseEntity> {
        // Verify user has access to the point
        const point = await this.pointRepository.findById(dto.pointId);

        if (!point) {
            throw new ForbiddenException('Точка не найдена');
        }

        // Verify user has access to the point (either as owner or member)
        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === dto.pointId);

        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        return this.warehouseRepository.create({
            name: dto.name,
            pointId: dto.pointId,
            address: dto.address,
            description: dto.description,
        });
    }
}
