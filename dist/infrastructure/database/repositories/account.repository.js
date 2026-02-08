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
exports.AccountRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const account_entity_1 = require("../../../domain/entities/account.entity");
let AccountRepository = class AccountRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
        if (!account)
            return null;
        return account_entity_1.AccountEntity.create({
            id: account.id,
            name: account.name,
            ownerId: account.ownerId,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        });
    }
    async findByOwnerId(ownerId) {
        const accounts = await this.prisma.account.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
        });
        return accounts.map((a) => account_entity_1.AccountEntity.create({
            id: a.id,
            name: a.name,
            ownerId: a.ownerId,
            isActive: a.isActive,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        }));
    }
    async create(data) {
        const account = await this.prisma.account.create({
            data: {
                name: data.name,
                ownerId: data.ownerId,
                isActive: data.isActive ?? true,
            },
        });
        return account_entity_1.AccountEntity.create({
            id: account.id,
            name: account.name,
            ownerId: account.ownerId,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        });
    }
    async update(id, data) {
        const account = await this.prisma.account.update({
            where: { id },
            data: {
                name: data.name,
                isActive: data.isActive,
            },
        });
        return account_entity_1.AccountEntity.create({
            id: account.id,
            name: account.name,
            ownerId: account.ownerId,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        });
    }
    async delete(id) {
        await this.prisma.account.delete({
            where: { id },
        });
    }
};
exports.AccountRepository = AccountRepository;
exports.AccountRepository = AccountRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountRepository);
//# sourceMappingURL=account.repository.js.map