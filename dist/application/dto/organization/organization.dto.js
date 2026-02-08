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
exports.PointResponseDto = exports.AccountResponseDto = exports.CreatePointDto = exports.CreateAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAccountDto {
}
exports.CreateAccountDto = CreateAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название организации', example: 'Моя компания' }),
    (0, class_validator_1.IsString)({ message: 'Название должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Название обязательно' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Название не более 100 символов' }),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "name", void 0);
class CreatePointDto {
}
exports.CreatePointDto = CreatePointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название точки', example: 'Главный офис' }),
    (0, class_validator_1.IsString)({ message: 'Название должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Название обязательно' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Название не более 100 символов' }),
    __metadata("design:type", String)
], CreatePointDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Адрес точки', example: 'ул. Ленина, 1' }),
    (0, class_validator_1.IsString)({ message: 'Адрес должен быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Адрес не более 255 символов' }),
    __metadata("design:type", String)
], CreatePointDto.prototype, "address", void 0);
class AccountResponseDto {
}
exports.AccountResponseDto = AccountResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID организации' }),
    __metadata("design:type", String)
], AccountResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название' }),
    __metadata("design:type", String)
], AccountResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID владельца' }),
    __metadata("design:type", String)
], AccountResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активна ли организация' }),
    __metadata("design:type", Boolean)
], AccountResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", Date)
], AccountResponseDto.prototype, "createdAt", void 0);
class PointResponseDto {
}
exports.PointResponseDto = PointResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID точки' }),
    __metadata("design:type", String)
], PointResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название' }),
    __metadata("design:type", String)
], PointResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Адрес' }),
    __metadata("design:type", Object)
], PointResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID организации' }),
    __metadata("design:type", String)
], PointResponseDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активна ли точка' }),
    __metadata("design:type", Boolean)
], PointResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", Date)
], PointResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=organization.dto.js.map