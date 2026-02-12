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
exports.OrgSettingsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const org_settings_entity_1 = require("../../../domain/entities/org-settings.entity");
let OrgSettingsRepository = class OrgSettingsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByAccountId(accountId) {
        const settings = await this.prisma.orgSettings.findUnique({
            where: { accountId },
        });
        if (!settings)
            return null;
        return org_settings_entity_1.OrgSettingsEntity.create({
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        });
    }
    async upsert(accountId, data) {
        const settings = await this.prisma.orgSettings.upsert({
            where: { accountId },
            create: {
                accountId,
                canAddEmployees: data.canAddEmployees ?? true,
                canAddPoints: data.canAddPoints ?? true,
                canAddWarehouses: data.canAddWarehouses ?? true,
                canAddProducts: data.canAddProducts ?? false,
            },
            update: {
                canAddEmployees: data.canAddEmployees,
                canAddPoints: data.canAddPoints,
                canAddWarehouses: data.canAddWarehouses,
                canAddProducts: data.canAddProducts,
            },
        });
        return org_settings_entity_1.OrgSettingsEntity.create({
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        });
    }
};
exports.OrgSettingsRepository = OrgSettingsRepository;
exports.OrgSettingsRepository = OrgSettingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrgSettingsRepository);
//# sourceMappingURL=org-settings.repository.js.map