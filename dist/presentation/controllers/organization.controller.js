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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../decorators");
const user_entity_1 = require("../../domain/entities/user.entity");
const organization_1 = require("../../application/dto/organization");
const organization_2 = require("../../application/use-cases/organization");
let OrganizationController = class OrganizationController {
    constructor(createAccountUseCase, getAccountsUseCase, getAllAccountsUseCase, createPointUseCase, getPointsUseCase, updatePointUseCase) {
        this.createAccountUseCase = createAccountUseCase;
        this.getAccountsUseCase = getAccountsUseCase;
        this.getAllAccountsUseCase = getAllAccountsUseCase;
        this.createPointUseCase = createPointUseCase;
        this.getPointsUseCase = getPointsUseCase;
        this.updatePointUseCase = updatePointUseCase;
    }
    async createAccount(userId, dto) {
        return this.createAccountUseCase.execute(userId, dto);
    }
    async getAccounts(userId) {
        return this.getAccountsUseCase.execute(userId);
    }
    async getAllAccounts() {
        return this.getAllAccountsUseCase.execute();
    }
    async createPoint(userId, accountId, dto) {
        return this.createPointUseCase.execute(userId, accountId, dto);
    }
    async getPoints(userId) {
        return this.getPointsUseCase.execute(userId);
    }
    async getPointsByAccount(accountId) {
        return this.getPointsUseCase.executeByAccountId(accountId);
    }
    async updatePoint(userId, pointId, dto) {
        return this.updatePointUseCase.execute(userId, pointId, dto);
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Post)('accounts'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiOperation)({ summary: 'Создать организацию' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Организация создана', type: organization_1.AccountResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organization_1.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Get)('accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить организации пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список организаций', type: [organization_1.AccountResponseDto] }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getAccounts", null);
__decorate([
    (0, common_1.Get)('accounts/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все организации' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список всех организаций', type: [organization_1.AccountResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getAllAccounts", null);
__decorate([
    (0, common_1.Post)('accounts/:accountId/points'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiOperation)({ summary: 'Создать точку в организации' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Точка создана', type: organization_1.PointResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('accountId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organization_1.CreatePointDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createPoint", null);
__decorate([
    (0, common_1.Get)('points'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все точки пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список точек', type: [organization_1.PointResponseDto] }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getPoints", null);
__decorate([
    (0, common_1.Get)('accounts/:accountId/points'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить точки организации' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список точек', type: [organization_1.PointResponseDto] }),
    __param(0, (0, common_1.Param)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getPointsByAccount", null);
__decorate([
    (0, common_1.Put)('points/:pointId'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить точку' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Точка обновлена', type: organization_1.PointResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('pointId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organization_1.CreatePointDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updatePoint", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, swagger_1.ApiTags)('Организации'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [organization_2.CreateAccountUseCase,
        organization_2.GetAccountsUseCase,
        organization_2.GetAllAccountsUseCase,
        organization_2.CreatePointUseCase,
        organization_2.GetPointsUseCase,
        organization_2.UpdatePointUseCase])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map