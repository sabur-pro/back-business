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
exports.PointAssignmentResponseDto = exports.UpdateEmployeePermissionsDto = exports.EmployeeResponseDto = exports.AssignPointDto = exports.CreateEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEmployeeDto {
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email сотрудника', example: 'employee@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email обязателен' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Пароль', example: 'password123' }),
    (0, class_validator_1.IsString)({ message: 'Пароль должен быть строкой' }),
    (0, class_validator_1.MinLength)(6, { message: 'Пароль минимум 6 символов' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя', example: 'Иван' }),
    (0, class_validator_1.IsString)({ message: 'Имя должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Имя обязательно' }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Фамилия', example: 'Петров' }),
    (0, class_validator_1.IsString)({ message: 'Фамилия должна быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Фамилия обязательна' }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Телефон', example: '+7 999 123-45-67' }),
    (0, class_validator_1.IsString)({ message: 'Телефон должен быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "phone", void 0);
class AssignPointDto {
}
exports.AssignPointDto = AssignPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID точки' }),
    (0, class_validator_1.IsString)({ message: 'ID точки должен быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID точки обязателен' }),
    __metadata("design:type", String)
], AssignPointDto.prototype, "pointId", void 0);
class EmployeeResponseDto {
}
exports.EmployeeResponseDto = EmployeeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID сотрудника' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Фамилия' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Полное имя' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Телефон' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Роль' }),
    __metadata("design:type", String)
], EmployeeResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Может создавать отправки' }),
    __metadata("design:type", Boolean)
], EmployeeResponseDto.prototype, "canCreateShipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Может принимать отправки' }),
    __metadata("design:type", Boolean)
], EmployeeResponseDto.prototype, "canReceiveShipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Активен' }),
    __metadata("design:type", Boolean)
], EmployeeResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", Date)
], EmployeeResponseDto.prototype, "createdAt", void 0);
class UpdateEmployeePermissionsDto {
}
exports.UpdateEmployeePermissionsDto = UpdateEmployeePermissionsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Может создавать отправки' }),
    (0, class_validator_1.IsBoolean)({ message: 'canCreateShipment должен быть boolean' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEmployeePermissionsDto.prototype, "canCreateShipment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Может принимать отправки' }),
    (0, class_validator_1.IsBoolean)({ message: 'canReceiveShipment должен быть boolean' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEmployeePermissionsDto.prototype, "canReceiveShipment", void 0);
class PointAssignmentResponseDto {
}
exports.PointAssignmentResponseDto = PointAssignmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID назначения' }),
    __metadata("design:type", String)
], PointAssignmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID точки' }),
    __metadata("design:type", String)
], PointAssignmentResponseDto.prototype, "pointId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название точки' }),
    __metadata("design:type", String)
], PointAssignmentResponseDto.prototype, "pointName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID сотрудника' }),
    __metadata("design:type", String)
], PointAssignmentResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Роль' }),
    __metadata("design:type", String)
], PointAssignmentResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата назначения' }),
    __metadata("design:type", Date)
], PointAssignmentResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=employee.dto.js.map