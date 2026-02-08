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
exports.PointRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const point_entity_1 = require("../../../domain/entities/point.entity");
let PointRepository = class PointRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const point = await this.prisma.point.findUnique({
            where: { id },
        });
        if (!point)
            return null;
        return point_entity_1.PointEntity.create({
            id: point.id,
            name: point.name,
            address: point.address,
            accountId: point.accountId,
            isActive: point.isActive,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt,
        });
    }
    async findByAccountId(accountId) {
        const points = await this.prisma.point.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });
        return points.map((p) => point_entity_1.PointEntity.create({
            id: p.id,
            name: p.name,
            address: p.address,
            accountId: p.accountId,
            isActive: p.isActive,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
    async findByUserId(userId) {
        const ownedPoints = await this.prisma.point.findMany({
            where: {
                account: {
                    ownerId: userId,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
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
        const allPoints = [...ownedPoints, ...memberPoints].reduce((acc, point) => {
            if (!acc.find((p) => p.id === point.id)) {
                acc.push(point);
            }
            return acc;
        }, []);
        return allPoints.map((p) => point_entity_1.PointEntity.create({
            id: p.id,
            name: p.name,
            address: p.address,
            accountId: p.accountId,
            isActive: p.isActive,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }
    async create(data) {
        const point = await this.prisma.point.create({
            data: {
                name: data.name,
                address: data.address,
                accountId: data.accountId,
                isActive: data.isActive ?? true,
            },
        });
        return point_entity_1.PointEntity.create({
            id: point.id,
            name: point.name,
            address: point.address,
            accountId: point.accountId,
            isActive: point.isActive,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt,
        });
    }
    async update(id, data) {
        const point = await this.prisma.point.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                isActive: data.isActive,
            },
        });
        return point_entity_1.PointEntity.create({
            id: point.id,
            name: point.name,
            address: point.address,
            accountId: point.accountId,
            isActive: point.isActive,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt,
        });
    }
    async delete(id) {
        await this.prisma.point.delete({
            where: { id },
        });
    }
};
exports.PointRepository = PointRepository;
exports.PointRepository = PointRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PointRepository);
//# sourceMappingURL=point.repository.js.map