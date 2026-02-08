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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../decorators");
const user_entity_1 = require("../../domain/entities/user.entity");
const settings_1 = require("../../application/dto/settings");
const settings_2 = require("../../application/use-cases/settings");
let SettingsController = class SettingsController {
    constructor(getOrgSettingsUseCase, updateOrgSettingsUseCase) {
        this.getOrgSettingsUseCase = getOrgSettingsUseCase;
        this.updateOrgSettingsUseCase = updateOrgSettingsUseCase;
    }
    async getSettings(userId) {
        return this.getOrgSettingsUseCase.execute(userId);
    }
    async updateSettings(userId, dto) {
        return this.updateOrgSettingsUseCase.execute(userId, dto);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить настройки организации' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Настройки', type: settings_1.OrgSettingsResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)(),
    (0, decorators_1.Roles)(user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить настройки организации' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Настройки обновлены', type: settings_1.OrgSettingsResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, settings_1.UpdateOrgSettingsDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateSettings", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Настройки'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_2.GetOrgSettingsUseCase,
        settings_2.UpdateOrgSettingsUseCase])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map