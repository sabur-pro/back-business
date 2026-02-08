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
exports.TokenResponseDto = exports.AuthResponseDto = exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Имя пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Фамилия пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Полное имя пользователя' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Телефон' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Роль пользователя', enum: ['ORGANIZER', 'POINT_ADMIN'] }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID организации (для сотрудников)' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "accountId", void 0);
class AuthResponseDto {
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT Access Token' }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refresh Token для обновления access token' }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Данные пользователя', type: UserResponseDto }),
    __metadata("design:type", UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
class TokenResponseDto {
}
exports.TokenResponseDto = TokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT Access Token' }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refresh Token' }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=auth-response.dto.js.map