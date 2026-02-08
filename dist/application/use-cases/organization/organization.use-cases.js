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
exports.GetPointsUseCase = exports.UpdatePointUseCase = exports.CreatePointUseCase = exports.GetAccountsUseCase = exports.CreateAccountUseCase = void 0;
const common_1 = require("@nestjs/common");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const point_repository_interface_1 = require("../../../domain/repositories/point.repository.interface");
let CreateAccountUseCase = class CreateAccountUseCase {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(userId, dto) {
        return this.accountRepository.create({
            name: dto.name,
            ownerId: userId,
        });
    }
};
exports.CreateAccountUseCase = CreateAccountUseCase;
exports.CreateAccountUseCase = CreateAccountUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateAccountUseCase);
let GetAccountsUseCase = class GetAccountsUseCase {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(userId) {
        return this.accountRepository.findByOwnerId(userId);
    }
};
exports.GetAccountsUseCase = GetAccountsUseCase;
exports.GetAccountsUseCase = GetAccountsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAccountsUseCase);
let CreatePointUseCase = class CreatePointUseCase {
    constructor(pointRepository, accountRepository) {
        this.pointRepository = pointRepository;
        this.accountRepository = accountRepository;
    }
    async execute(userId, accountId, dto) {
        const accounts = await this.accountRepository.findByOwnerId(userId);
        const hasAccess = accounts.some((a) => a.id === accountId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Нет доступа к данной организации');
        }
        return this.pointRepository.create({
            name: dto.name,
            address: dto.address,
            accountId,
        });
    }
};
exports.CreatePointUseCase = CreatePointUseCase;
exports.CreatePointUseCase = CreatePointUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(point_repository_interface_1.POINT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CreatePointUseCase);
let UpdatePointUseCase = class UpdatePointUseCase {
    constructor(pointRepository, accountRepository) {
        this.pointRepository = pointRepository;
        this.accountRepository = accountRepository;
    }
    async execute(userId, pointId, dto) {
        const accounts = await this.accountRepository.findByOwnerId(userId);
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new common_1.ForbiddenException('Точка не найдена');
        }
        const hasAccess = accounts.some((a) => a.id === point.accountId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Нет доступа к данной точке');
        }
        return this.pointRepository.update(pointId, {
            name: dto.name,
            address: dto.address,
        });
    }
};
exports.UpdatePointUseCase = UpdatePointUseCase;
exports.UpdatePointUseCase = UpdatePointUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(point_repository_interface_1.POINT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], UpdatePointUseCase);
let GetPointsUseCase = class GetPointsUseCase {
    constructor(pointRepository) {
        this.pointRepository = pointRepository;
    }
    async execute(userId) {
        return this.pointRepository.findByUserId(userId);
    }
    async executeByAccountId(accountId) {
        return this.pointRepository.findByAccountId(accountId);
    }
};
exports.GetPointsUseCase = GetPointsUseCase;
exports.GetPointsUseCase = GetPointsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(point_repository_interface_1.POINT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetPointsUseCase);
//# sourceMappingURL=organization.use-cases.js.map