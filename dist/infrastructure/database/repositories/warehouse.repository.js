"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const warehouse_entity_1 = require("../../../domain/entities/warehouse.entity");
let WarehouseRepository = class WarehouseRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id },
        });
        if (!warehouse)
            return null;
        return this.mapToEntity(warehouse);
    }
    async findByPointId(pointId) {
        const warehouses = await this.prisma.warehouse.findMany({
            where: { pointId },
            orderBy: { createdAt: 'desc' },
        });
        return warehouses.map((w) => this.mapToEntity(w));
    }
    async findByPointIdAndType(pointId, type) {
        const warehouses = await this.prisma.warehouse.findMany({
            where: { pointId, type },
            orderBy: { createdAt: 'desc' },
        });
        return warehouses.map((w) => this.mapToEntity(w));
    }
    async findByPointIdAndName(pointId, name) {
        const warehouse = await this.prisma.warehouse.findFirst({
            where: { pointId, name },
        });
        if (!warehouse)
            return null;
        return this.mapToEntity(warehouse);
    }
    async findByUserId(userId) {
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
        const allWarehouses = [...ownedWarehouses, ...memberWarehouses].reduce((acc, warehouse) => {
            if (!acc.find((w) => w.id === warehouse.id)) {
                acc.push(warehouse);
            }
            return acc;
        }, []);
        return allWarehouses.map((w) => this.mapToEntity(w));
    }
    async findByUserIdAndType(userId, type) {
        const all = await this.findByUserId(userId);
        return all.filter((w) => w.type === type);
    }
    async create(data) {
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
    async update(id, data) {
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
    async delete(id) {
        await this.prisma.warehouse.delete({
            where: { id },
        });
    }
    mapToEntity(w) {
        return warehouse_entity_1.WarehouseEntity.create({
            id: w.id,
            name: w.name,
            type: w.type,
            pointId: w.pointId,
            address: w.address,
            description: w.description,
            isActive: w.isActive,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
        });
    }
};
exports.WarehouseRepository = WarehouseRepository;
exports.WarehouseRepository = WarehouseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarehouseRepository);
//# sourceMappingURL=warehouse.repository.js.map