import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IWarehouseRepository,
    CreateWarehouseData,
    UpdateWarehouseData,
} from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity, WarehouseType } from '@domain/entities/warehouse.entity';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<WarehouseEntity | null> {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id },
        });

        if (!warehouse) return null;

        return this.mapToEntity(warehouse);
    }

    async findByPointId(pointId: string): Promise<WarehouseEntity[]> {
        const warehouses = await this.prisma.warehouse.findMany({
            where: { pointId },
            orderBy: { createdAt: 'desc' },
        });

        return warehouses.map((w) => this.mapToEntity(w));
    }

    async findByPointIdAndType(pointId: string, type: WarehouseType): Promise<WarehouseEntity[]> {
        const warehouses = await this.prisma.warehouse.findMany({
            where: { pointId, type },
            orderBy: { createdAt: 'desc' },
        });

        return warehouses.map((w) => this.mapToEntity(w));
    }

    async findByPointIdAndName(pointId: string, name: string): Promise<WarehouseEntity | null> {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: { pointId, name },
        });

        if (!warehouse) return null;

        return this.mapToEntity(warehouse);
    }

    async findByUserId(userId: string): Promise<WarehouseEntity[]> {
        // Find warehouses in points owned by user's account
        const ownedWarehouses = await this.prisma.warehouse.findMany({
            where: {
                point: {
                    account: {
                        ownerId: userId,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Find warehouses in points where user is a member
        const memberWarehouses = await this.prisma.warehouse.findMany({
            where: {
                point: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Combine and deduplicate
        const allWarehouses = [...ownedWarehouses, ...memberWarehouses].reduce((acc, warehouse) => {
            if (!acc.find((w) => w.id === warehouse.id)) {
                acc.push(warehouse);
            }
            return acc;
        }, [] as any[]);

        return allWarehouses.map((w) => this.mapToEntity(w));
    }

    async findByUserIdAndType(userId: string, type: WarehouseType): Promise<WarehouseEntity[]> {
        const all = await this.findByUserId(userId);
        return all.filter((w) => w.type === type);
    }

    async create(data: CreateWarehouseData): Promise<WarehouseEntity> {
        const warehouse = await this.prisma.warehouse.create({
            data: {
                name: data.name,
                type: data.type ?? 'WAREHOUSE',
                pointId: data.pointId,
                address: data.address,
                description: data.description,
                isActive: data.isActive ?? true,
            },
        });

        return this.mapToEntity(warehouse);
    }

    async update(id: string, data: UpdateWarehouseData): Promise<WarehouseEntity> {
        const warehouse = await this.prisma.warehouse.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                isActive: data.isActive,
            },
        });

        return this.mapToEntity(warehouse);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.warehouse.delete({
            where: { id },
        });
    }

    private mapToEntity(w: any): WarehouseEntity {
        return WarehouseEntity.create({
            id: w.id,
            name: w.name,
            type: w.type as WarehouseType,
            pointId: w.pointId,
            address: w.address,
            description: w.description,
            isActive: w.isActive,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
        });
    }
}
