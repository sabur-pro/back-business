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
exports.CreateWarehouseUseCase = void 0;
const common_1 = require("@nestjs/common");
const warehouse_repository_interface_1 = require("../../../domain/repositories/warehouse.repository.interface");
const point_repository_interface_1 = require("../../../domain/repositories/point.repository.interface");
let CreateWarehouseUseCase = class CreateWarehouseUseCase {
    constructor(warehouseRepository, pointRepository) {
        this.warehouseRepository = warehouseRepository;
        this.pointRepository = pointRepository;
    }
    async execute(userId, dto) {
        const point = await this.pointRepository.findById(dto.pointId);
        if (!point) {
            throw new common_1.ForbiddenException('Точка не найдена');
        }
        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === dto.pointId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Нет доступа к данной точке');
        }
        return this.warehouseRepository.create({
            name: dto.name,
            type: dto.type,
            pointId: dto.pointId,
            address: dto.address,
            description: dto.description,
        });
    }
};
exports.CreateWarehouseUseCase = CreateWarehouseUseCase;
exports.CreateWarehouseUseCase = CreateWarehouseUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(warehouse_repository_interface_1.WAREHOUSE_REPOSITORY)),
    __param(1, (0, common_1.Inject)(point_repository_interface_1.POINT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CreateWarehouseUseCase);
//# sourceMappingURL=create-warehouse.use-case.js.map