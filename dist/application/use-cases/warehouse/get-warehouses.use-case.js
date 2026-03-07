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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWarehousesUseCase = void 0;
const common_1 = require("@nestjs/common");
const warehouse_repository_interface_1 = require("../../../domain/repositories/warehouse.repository.interface");
const prisma_service_1 = require("../../../infrastructure/database/prisma/prisma.service");
let GetWarehousesUseCase = class GetWarehousesUseCase {
    constructor(warehouseRepository, prisma) {
        this.warehouseRepository = warehouseRepository;
        this.prisma = prisma;
    }
    async execute(userId) {
        return this.warehouseRepository.findByUserId(userId);
    }
    async executeWithStats(userId) {
        const warehouses = await this.warehouseRepository.findByUserId(userId);
        const warehouseIds = warehouses.map(w => w.id);
        if (warehouseIds.length === 0)
            return [];
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
    async executeById(id) {
        return this.warehouseRepository.findById(id);
    }
    async executeByPointId(pointId) {
        return this.warehouseRepository.findByPointId(pointId);
    }
    async executeByPointIdWithStats(pointId) {
        const warehouses = await this.warehouseRepository.findByPointId(pointId);
        const warehouseIds = warehouses.map(w => w.id);
        if (warehouseIds.length === 0)
            return [];
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
};
exports.GetWarehousesUseCase = GetWarehousesUseCase;
exports.GetWarehousesUseCase = GetWarehousesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(warehouse_repository_interface_1.WAREHOUSE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], GetWarehousesUseCase);
//# sourceMappingURL=get-warehouses.use-case.js.map