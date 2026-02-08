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
exports.WarehouseResponseDto = exports.UpdateWarehouseDto = exports.CreateWarehouseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateWarehouseDto {
}
exports.CreateWarehouseDto = CreateWarehouseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название склада', example: 'Основной склад' }),
    (0, class_validator_1.IsString)({ message: 'Название должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Название обязательно' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Название не более 100 символов' }),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID точки', example: 'uuid' }),
    (0, class_validator_1.IsString)({ message: 'ID точки должен быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID точки обязателен' }),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "pointId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Адрес склада', example: 'ул. Складская, 1' }),
    (0, class_validator_1.IsString)({ message: 'Адрес должен быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Адрес не более 255 символов' }),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Описание склада', example: 'Главный склад для хранения товаров' }),
    (0, class_validator_1.IsString)({ message: 'Описание должно быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Описание не более 500 символов' }),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "description", void 0);
class UpdateWarehouseDto {
}
exports.UpdateWarehouseDto = UpdateWarehouseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Название склада', example: 'Основной склад' }),
    (0, class_validator_1.IsString)({ message: 'Название должно быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Название не более 100 символов' }),
    __metadata("design:type", String)
], UpdateWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Адрес склада', example: 'ул. Складская, 1' }),
    (0, class_validator_1.IsString)({ message: 'Адрес должен быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Адрес не более 255 символов' }),
    __metadata("design:type", String)
], UpdateWarehouseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Описание склада' }),
    (0, class_validator_1.IsString)({ message: 'Описание должно быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Описание не более 500 символов' }),
    __metadata("design:type", String)
], UpdateWarehouseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Активен ли склад', example: true }),
    (0, class_validator_1.IsBoolean)({ message: 'isActive должен быть булевым' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateWarehouseDto.prototype, "isActive", void 0);
class WarehouseResponseDto {
}
exports.WarehouseResponseDto = WarehouseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID склада' }),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название склада' }),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID точки' }),
    __metadata("design:type", String)
], WarehouseResponseDto.prototype, "pointId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Адрес склада' }),
    __metadata("design:type", Object)
], WarehouseResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Описание' }),
    __metadata("design:type", Object)
], WarehouseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активен ли склад' }),
    __metadata("design:type", Boolean)
], WarehouseResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", Date)
], WarehouseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата обновления' }),
    __metadata("design:type", Date)
], WarehouseResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=warehouse.dto.js.map