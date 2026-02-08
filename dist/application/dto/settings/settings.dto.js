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
exports.OrgSettingsResponseDto = exports.UpdateOrgSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateOrgSettingsDto {
}
exports.UpdateOrgSettingsDto = UpdateOrgSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Разрешить добавление сотрудников', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrgSettingsDto.prototype, "canAddEmployees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Разрешить добавление точек', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrgSettingsDto.prototype, "canAddPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Разрешить добавление складов', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrgSettingsDto.prototype, "canAddWarehouses", void 0);
class OrgSettingsResponseDto {
}
exports.OrgSettingsResponseDto = OrgSettingsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrgSettingsResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrgSettingsResponseDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], OrgSettingsResponseDto.prototype, "canAddEmployees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], OrgSettingsResponseDto.prototype, "canAddPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], OrgSettingsResponseDto.prototype, "canAddWarehouses", void 0);
//# sourceMappingURL=settings.dto.js.map