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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("../../../domain/entities/user.entity");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return user_entity_1.UserEntity.create({
            ...user,
            role: user.role,
        });
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        return user_entity_1.UserEntity.create({
            ...user,
            role: user.role,
        });
    }
    async findByAccountId(accountId) {
        const users = await this.prisma.user.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });
        return users.map((u) => user_entity_1.UserEntity.create({
            ...u,
            role: u.role,
        }));
    }
    async create(data) {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone ?? null,
                role: data.role ?? 'ORGANIZER',
                accountId: data.accountId ?? null,
                isActive: data.isActive ?? true,
            },
        });
        return user_entity_1.UserEntity.create({
            ...user,
            role: user.role,
        });
    }
    async update(id, data) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...(data.email && { email: data.email }),
                ...(data.password && { password: data.password }),
                ...(data.firstName && { firstName: data.firstName }),
                ...(data.lastName && { lastName: data.lastName }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.role && { role: data.role }),
                ...(data.accountId !== undefined && { accountId: data.accountId }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        });
        return user_entity_1.UserEntity.create({
            ...user,
            role: user.role,
        });
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map