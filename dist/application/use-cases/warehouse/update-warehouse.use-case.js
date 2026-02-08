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
exports.UpdateWarehouseUseCase = void 0;
const common_1 = require("@nestjs/common");
const warehouse_repository_interface_1 = require("../../../domain/repositories/warehouse.repository.interface");
let UpdateWarehouseUseCase = class UpdateWarehouseUseCase {
    constructor(warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }
    async execute(userId, warehouseId, dto) {
        const userWarehouses = await this.warehouseRepository.findByUserId(userId);
        const hasAccess = userWarehouses.some((w) => w.id === warehouseId);
        if (!hasAccess) {
            const exists = await this.warehouseRepository.findById(warehouseId);
            if (!exists) {
                throw new common_1.NotFoundException('Склад не найден');
            }
            throw new common_1.ForbiddenException('Нет доступа к данному складу');
        }
        return this.warehouseRepository.update(warehouseId, {
            name: dto.name,
            address: dto.address,
            description: dto.description,
            isActive: dto.isActive,
        });
    }
};
exports.UpdateWarehouseUseCase = UpdateWarehouseUseCase;
exports.UpdateWarehouseUseCase = UpdateWarehouseUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(warehouse_repository_interface_1.WAREHOUSE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdateWarehouseUseCase);
//# sourceMappingURL=update-warehouse.use-case.js.map