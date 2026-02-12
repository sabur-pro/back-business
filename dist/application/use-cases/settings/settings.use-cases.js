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
exports.UpdateOrgSettingsUseCase = exports.GetOrgSettingsUseCase = void 0;
const common_1 = require("@nestjs/common");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const org_settings_repository_interface_1 = require("../../../domain/repositories/org-settings.repository.interface");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const user_entity_1 = require("../../../domain/entities/user.entity");
let GetOrgSettingsUseCase = class GetOrgSettingsUseCase {
    constructor(userRepository, accountRepository, orgSettingsRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.orgSettingsRepository = orgSettingsRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new common_1.ForbiddenException('Пользователь не найден');
        let accountId;
        if (user.role === user_entity_1.UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(userId);
            if (accounts.length === 0) {
                return {
                    id: '',
                    accountId: '',
                    canAddEmployees: true,
                    canAddPoints: true,
                    canAddWarehouses: true,
                    canAddProducts: false,
                };
            }
            accountId = accounts[0].id;
        }
        else {
            if (!user.accountId) {
                return {
                    id: '',
                    accountId: '',
                    canAddEmployees: true,
                    canAddPoints: true,
                    canAddWarehouses: true,
                    canAddProducts: false,
                };
            }
            accountId = user.accountId;
        }
        const settings = await this.orgSettingsRepository.findByAccountId(accountId);
        if (!settings) {
            return {
                id: '',
                accountId,
                canAddEmployees: true,
                canAddPoints: true,
                canAddWarehouses: true,
                canAddProducts: false,
            };
        }
        return {
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
        };
    }
};
exports.GetOrgSettingsUseCase = GetOrgSettingsUseCase;
exports.GetOrgSettingsUseCase = GetOrgSettingsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(org_settings_repository_interface_1.ORG_SETTINGS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetOrgSettingsUseCase);
let UpdateOrgSettingsUseCase = class UpdateOrgSettingsUseCase {
    constructor(userRepository, accountRepository, orgSettingsRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.orgSettingsRepository = orgSettingsRepository;
    }
    async execute(userId, dto) {
        const user = await this.userRepository.findById(userId);
        if (!user || user.role !== user_entity_1.UserRole.ORGANIZER) {
            throw new common_1.ForbiddenException('Только организатор может изменять настройки');
        }
        const accounts = await this.accountRepository.findByOwnerId(userId);
        if (accounts.length === 0) {
            throw new common_1.ForbiddenException('У вас нет организации');
        }
        const accountId = accounts[0].id;
        const settings = await this.orgSettingsRepository.upsert(accountId, {
            canAddEmployees: dto.canAddEmployees,
            canAddPoints: dto.canAddPoints,
            canAddWarehouses: dto.canAddWarehouses,
            canAddProducts: dto.canAddProducts,
        });
        return {
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
        };
    }
};
exports.UpdateOrgSettingsUseCase = UpdateOrgSettingsUseCase;
exports.UpdateOrgSettingsUseCase = UpdateOrgSettingsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(org_settings_repository_interface_1.ORG_SETTINGS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateOrgSettingsUseCase);
//# sourceMappingURL=settings.use-cases.js.map