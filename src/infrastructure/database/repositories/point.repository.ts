import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IPointRepository,
    CreatePointData,
    UpdatePointData,
} from '@domain/repositories/point.repository.interface';
import { PointEntity } from '@domain/entities/point.entity';

@Injectable()
export class PointRepository implements IPointRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<PointEntity | null> {
        const point = await this.prisma.point.findUnique({
            where: { id },
        });

        if (!point) return null;

        return PointEntity.create({
            id: point.id,
            name: point.name,
            address: point.address,
            accountId: point.accountId,
            isActive: point.isActive,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt,
        });
    }

    async findByAccountId(accountId: string): Promise<PointEntity[]> {
        const points = await this.prisma.point.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });

        return points.map((p) =>
            PointEntity.create({
                id: p.id,
                name: p.name,
                address: p.address,
                accountId: p.accountId,
                isActive: p.isActive,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }),
        );
    }

    async findByUserId(userId: string): Promise<PointEntity[]> {
        // Find points owned by user's account
        const ownedPoints = await this.prisma.point.findMany({
            where: {
                account: {
                    ownerId: userId,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Find points where user is a member
        const memberPoints = await this.prisma.point.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Combine and deduplicate
        const allPoints = [...ownedPoints, ...memberPoints].reduce((acc, point) => {
            if (!acc.find((p) => p.id === point.id)) {
                acc.push(point);
            }
            return acc;
        }, [] as any[]);

        return allPoints.map((p) =>
            PointEntity.create({
                id: p.id,
                name: p.name,
                address: p.address,
                accountId: p.accountId,
                isActive: p.isActive,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }),
        );
    }

    async create(data: CreatePointData): Promise<PointEntity> {
        const point = await this.prisma.point.create({
            data: {
                name: data.name,
                address: data.address,
                accountId: data.accountId,
                isActive: data.isActive ?? true,
            },
        });

        return PointEntity.create({
            id: point.id,
            name: point.name,
            address: point.address,
            accountId: point.accountId,
            isActive: point.isActive,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt,
        });
    }

    async update(id: string, data: UpdatePointData): Promise<PointEntity> {
        const point = await this.prisma.point.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                isActive: data.isActive,
            },
        });

        return PointEntity.create({
            id: point.id,
            name: point.name,
            address: point.address,
            accountId: point.accountId,
            isActive: point.isActive,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.point.delete({
            where: { id },
        });
    }
}
