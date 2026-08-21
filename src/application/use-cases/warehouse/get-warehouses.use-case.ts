import { Inject, Injectable } from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

export interface WarehouseWithStats {
    warehouse: WarehouseEntity;
    productCount: number;
    totalPairs: number;
    totalBoxes: number;
}

@Injectable()
export class GetWarehousesUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string): Promise<WarehouseEntity[]> {
        return this.warehouseRepository.findByUserId(userId);
    }

    async executeWithStats(userId: string): Promise<WarehouseWithStats[]> {
        const warehouses = await this.warehouseRepository.findByUserId(userId);
        const warehouseIds = warehouses.map(w => w.id);

        if (warehouseIds.length === 0) return [];

        const stats = await this.prisma.product.groupBy({
            by: ['warehouseId'],
            where: { warehouseId: { in: warehouseIds }, deletedAt: null },
            _count: { id: true },
            _sum: { pairCount: true, boxCount: true },
        });

        const statsMap = new Map(stats.map(s => [s.warehouseId, s]));

        return warehouses.map(warehouse => {
            const s = statsMap.get(warehouse.id);
            return {
                warehouse,
                productCount: s?._count?.id ?? 0,
                totalPairs: Number(s?._sum?.pairCount ?? 0),
                totalBoxes: Number(s?._sum?.boxCount ?? 0),
            };
        });
    }

    async executeById(id: string): Promise<WarehouseEntity | null> {
        return this.warehouseRepository.findById(id);
    }

    async executeByPointId(pointId: string): Promise<WarehouseEntity[]> {
        return this.warehouseRepository.findByPointId(pointId);
    }

    async executeByPointIdWithStats(pointId: string): Promise<WarehouseWithStats[]> {
        const warehouses = await this.warehouseRepository.findByPointId(pointId);
        const warehouseIds = warehouses.map(w => w.id);

        if (warehouseIds.length === 0) return [];

        const stats = await this.prisma.product.groupBy({
            by: ['warehouseId'],
            where: { warehouseId: { in: warehouseIds }, deletedAt: null },
            _count: { id: true },
            _sum: { pairCount: true, boxCount: true },
        });

        const statsMap = new Map(stats.map(s => [s.warehouseId, s]));

        return warehouses.map(warehouse => {
            const s = statsMap.get(warehouse.id);
            return {
                warehouse,
                productCount: s?._count?.id ?? 0,
                totalPairs: Number(s?._sum?.pairCount ?? 0),
                totalBoxes: Number(s?._sum?.boxCount ?? 0),
            };
        });
    }
}
