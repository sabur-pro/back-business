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
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../decorators");
const warehouse_1 = require("../../application/dto/warehouse");
const warehouse_2 = require("../../application/use-cases/warehouse");
let WarehouseController = class WarehouseController {
    constructor(createWarehouseUseCase, getWarehousesUseCase, updateWarehouseUseCase, deleteWarehouseUseCase) {
        this.createWarehouseUseCase = createWarehouseUseCase;
        this.getWarehousesUseCase = getWarehousesUseCase;
        this.updateWarehouseUseCase = updateWarehouseUseCase;
        this.deleteWarehouseUseCase = deleteWarehouseUseCase;
    }
    async create(userId, dto) {
        return this.createWarehouseUseCase.execute(userId, dto);
    }
    async getAll(userId) {
        return this.getWarehousesUseCase.execute(userId);
    }
    async getByPoint(pointId) {
        return this.getWarehousesUseCase.executeByPointId(pointId);
    }
    async getById(id) {
        const warehouse = await this.getWarehousesUseCase.executeById(id);
        if (!warehouse) {
            throw new Error('Склад не найден');
        }
        return warehouse;
    }
    async update(userId, id, dto) {
        return this.updateWarehouseUseCase.execute(userId, id, dto);
    }
    async delete(userId, id) {
        return this.deleteWarehouseUseCase.execute(userId, id);
    }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать новый склад' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Склад создан', type: warehouse_1.WarehouseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет доступа к точке' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, warehouse_1.CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить все склады пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список складов', type: [warehouse_1.WarehouseResponseDto] }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('point/:pointId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить склады по точке' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список складов', type: [warehouse_1.WarehouseResponseDto] }),
    __param(0, (0, common_1.Param)('pointId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getByPoint", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить склад по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Склад', type: warehouse_1.WarehouseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить склад' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Склад обновлен', type: warehouse_1.WarehouseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет доступа к складу' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, warehouse_1.UpdateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить склад' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Склад удален' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет доступа к складу' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "delete", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, swagger_1.ApiTags)('Склады'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('warehouses'),
    __metadata("design:paramtypes", [warehouse_2.CreateWarehouseUseCase,
        warehouse_2.GetWarehousesUseCase,
        warehouse_2.UpdateWarehouseUseCase,
        warehouse_2.DeleteWarehouseUseCase])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map