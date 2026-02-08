import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IWarehouseRepository,
    CreateWarehouseData,
    UpdateWarehouseData,
} from '@domain/repositories/warehouse.repository.interface';
import { WarehouseEntity } from '@domain/entities/warehouse.entity';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<WarehouseEntity | null> {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id },
        });

        if (!warehouse) return null;

        return WarehouseEntity.create({
            id: warehouse.id,
            name: warehouse.name,
            pointId: warehouse.pointId,
            address: warehouse.address,
            description: warehouse.description,
            isActive: warehouse.isActive,
            createdAt: warehouse.createdAt,
            updatedAt: warehouse.updatedAt,
        });
    }

    async findByPointId(pointId: string): Promise<WarehouseEntity[]> {
        const warehouses = await this.prisma.warehouse.findMany({
            where: { pointId },
            orderBy: { createdAt: 'desc' },
        });

        return warehouses.map((w) =>
            WarehouseEntity.create({
                id: w.id,
                name: w.name,
                pointId: w.pointId,
                address: w.address,
                description: w.description,
                isActive: w.isActive,
                createdAt: w.createdAt,
                updatedAt: w.updatedAt,
            }),
        );
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

        return allWarehouses.map((w) =>
            WarehouseEntity.create({
                id: w.id,
                name: w.name,
                pointId: w.pointId,
                address: w.address,
                description: w.description,
                isActive: w.isActive,
                createdAt: w.createdAt,
                updatedAt: w.updatedAt,
            }),
        );
    }

    async create(data: CreateWarehouseData): Promise<WarehouseEntity> {
        const warehouse = await this.prisma.warehouse.create({
            data: {
                name: data.name,
                pointId: data.pointId,
                address: data.address,
                description: data.description,
                isActive: data.isActive ?? true,
            },
        });

        return WarehouseEntity.create({
            id: warehouse.id,
            name: warehouse.name,
            pointId: warehouse.pointId,
            address: warehouse.address,
            description: warehouse.description,
            isActive: warehouse.isActive,
            createdAt: warehouse.createdAt,
            updatedAt: warehouse.updatedAt,
        });
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

        return WarehouseEntity.create({
            id: warehouse.id,
            name: warehouse.name,
            pointId: warehouse.pointId,
            address: warehouse.address,
            description: warehouse.description,
            isActive: warehouse.isActive,
            createdAt: warehouse.createdAt,
            updatedAt: warehouse.updatedAt,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.warehouse.delete({
            where: { id },
        });
    }
}
