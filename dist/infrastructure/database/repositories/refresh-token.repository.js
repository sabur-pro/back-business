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
exports.RefreshTokenRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const refresh_token_entity_1 = require("../../../domain/entities/refresh-token.entity");
let RefreshTokenRepository = class RefreshTokenRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByToken(token) {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token },
        });
        if (!refreshToken)
            return null;
        return refresh_token_entity_1.RefreshTokenEntity.create(refreshToken);
    }
    async findByUserId(userId) {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { userId },
        });
        return tokens.map((token) => refresh_token_entity_1.RefreshTokenEntity.create(token));
    }
    async create(data) {
        const refreshToken = await this.prisma.refreshToken.create({
            data: {
                token: data.token,
                userId: data.userId,
                expiresAt: data.expiresAt,
            },
        });
        return refresh_token_entity_1.RefreshTokenEntity.create(refreshToken);
    }
    async deleteByToken(token) {
        await this.prisma.refreshToken.deleteMany({
            where: { token },
        });
    }
    async deleteByUserId(userId) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    async deleteExpired() {
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
};
exports.RefreshTokenRepository = RefreshTokenRepository;
exports.RefreshTokenRepository = RefreshTokenRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefreshTokenRepository);
//# sourceMappingURL=refresh-token.repository.js.map