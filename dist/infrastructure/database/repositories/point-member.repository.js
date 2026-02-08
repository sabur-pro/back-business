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
exports.PointMemberRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const point_member_entity_1 = require("../../../domain/entities/point-member.entity");
const user_entity_1 = require("../../../domain/entities/user.entity");
let PointMemberRepository = class PointMemberRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const member = await this.prisma.pointMember.findUnique({
            where: { id },
            include: { point: true },
        });
        if (!member)
            return null;
        return point_member_entity_1.PointMemberEntity.create({
            ...member,
            role: member.role,
            pointName: member.point.name,
        });
    }
    async findByPointId(pointId) {
        const members = await this.prisma.pointMember.findMany({
            where: { pointId },
            include: { point: true },
        });
        return members.map((m) => point_member_entity_1.PointMemberEntity.create({
            ...m,
            role: m.role,
            pointName: m.point.name,
        }));
    }
    async findByUserId(userId) {
        const members = await this.prisma.pointMember.findMany({
            where: { userId },
            include: { point: true },
        });
        return members.map((m) => point_member_entity_1.PointMemberEntity.create({
            ...m,
            role: m.role,
            pointName: m.point.name,
        }));
    }
    async findByPointAndUser(pointId, userId) {
        const member = await this.prisma.pointMember.findUnique({
            where: {
                pointId_userId: {
                    pointId,
                    userId,
                },
            },
            include: { point: true },
        });
        if (!member)
            return null;
        return point_member_entity_1.PointMemberEntity.create({
            ...member,
            role: member.role,
            pointName: member.point.name,
        });
    }
    async create(data) {
        const member = await this.prisma.pointMember.create({
            data: {
                pointId: data.pointId,
                userId: data.userId,
                role: data.role ?? user_entity_1.UserRole.POINT_ADMIN,
            },
            include: { point: true },
        });
        return point_member_entity_1.PointMemberEntity.create({
            ...member,
            role: member.role,
            pointName: member.point.name,
        });
    }
    async delete(id) {
        await this.prisma.pointMember.delete({
            where: { id },
        });
    }
    async deleteByPointAndUser(pointId, userId) {
        await this.prisma.pointMember.delete({
            where: {
                pointId_userId: {
                    pointId,
                    userId,
                },
            },
        });
    }
};
exports.PointMemberRepository = PointMemberRepository;
exports.PointMemberRepository = PointMemberRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PointMemberRepository);
//# sourceMappingURL=point-member.repository.js.map