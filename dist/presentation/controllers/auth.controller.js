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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../application/use-cases/auth");
const auth_2 = require("../../application/dto/auth");
const public_decorator_1 = require("../decorators/public.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
let AuthController = class AuthController {
    constructor(registerUseCase, loginUseCase, refreshTokenUseCase, logoutUseCase, getMeUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.logoutUseCase = logoutUseCase;
        this.getMeUseCase = getMeUseCase;
    }
    async register(dto) {
        return this.registerUseCase.execute(dto);
    }
    async login(dto) {
        return this.loginUseCase.execute(dto);
    }
    async refreshToken(dto) {
        return this.refreshTokenUseCase.execute(dto.refreshToken);
    }
    async logout(dto) {
        await this.logoutUseCase.execute(dto.refreshToken);
        return { message: 'Выход выполнен успешно' };
    }
    async logoutAll(user) {
        await this.logoutUseCase.executeAll(user.userId);
        return { message: 'Выход со всех устройств выполнен' };
    }
    async getMe(userId) {
        return this.getMeUseCase.execute(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Регистрация нового пользователя' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Пользователь успешно зарегистрирован',
        type: auth_2.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Некорректные данные' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Пользователь уже существует' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_2.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Вход в систему' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешная авторизация',
        type: auth_2.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Неверные учетные данные' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_2.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Обновление токенов' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Токены успешно обновлены',
        type: auth_2.TokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Недействительный refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_2.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Выход из системы' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Успешный выход' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_2.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Выход со всех устройств' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Выход со всех устройств выполнен' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение данных текущего пользователя' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Данные пользователя',
        type: auth_2.UserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизован' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_1.RegisterUseCase,
        auth_1.LoginUseCase,
        auth_1.RefreshTokenUseCase,
        auth_1.LogoutUseCase,
        auth_1.GetMeUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map