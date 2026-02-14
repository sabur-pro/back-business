import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IShopEmployeeRepository,
    CreateShopEmployeeData,
} from '@domain/repositories/shop-employee.repository.interface';
import { ShopEmployeeEntity } from '@domain/entities/shop-employee.entity';

@Injectable()
export class ShopEmployeeRepository implements IShopEmployeeRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<ShopEmployeeEntity | null> {
        const record = await this.prisma.shopEmployee.findUnique({
            where: { id },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                warehouse: { select: { name: true } },
            },
        });

        if (!record) return null;

        return this.mapToEntity(record);
    }

    async findByShopId(warehouseId: string): Promise<ShopEmployeeEntity[]> {
        const records = await this.prisma.shopEmployee.findMany({
            where: { warehouseId },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                warehouse: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return records.map((r) => this.mapToEntity(r));
    }

    async findByUserId(userId: string): Promise<ShopEmployeeEntity[]> {
        const records = await this.prisma.shopEmployee.findMany({
            where: { userId },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                warehouse: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return records.map((r) => this.mapToEntity(r));
    }

    async findByShopAndUser(warehouseId: string, userId: string): Promise<ShopEmployeeEntity | null> {
        const record = await this.prisma.shopEmployee.findUnique({
            where: { warehouseId_userId: { warehouseId, userId } },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                warehouse: { select: { name: true } },
            },
        });

        if (!record) return null;

        return this.mapToEntity(record);
    }

    async create(data: CreateShopEmployeeData): Promise<ShopEmployeeEntity> {
        const record = await this.prisma.shopEmployee.create({
            data: {
                warehouseId: data.warehouseId,
                userId: data.userId,
            },
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                warehouse: { select: { name: true } },
            },
        });

        return this.mapToEntity(record);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.shopEmployee.delete({
            where: { id },
        });
    }

    async deleteByShopAndUser(warehouseId: string, userId: string): Promise<void> {
        await this.prisma.shopEmployee.delete({
            where: { warehouseId_userId: { warehouseId, userId } },
        });
    }

    private mapToEntity(r: any): ShopEmployeeEntity {
        return ShopEmployeeEntity.create({
            id: r.id,
            warehouseId: r.warehouseId,
            userId: r.userId,
            createdAt: r.createdAt,
            userName: r.user ? `${r.user.firstName} ${r.user.lastName}` : undefined,
            userEmail: r.user?.email,
            userPhone: r.user?.phone,
            shopName: r.warehouse?.name,
        });
    }
}
