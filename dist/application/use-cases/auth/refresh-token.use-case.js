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
exports.RefreshTokenUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const refresh_token_repository_interface_1 = require("../../../domain/repositories/refresh-token.repository.interface");
const jwt_token_service_1 = require("../../../infrastructure/services/jwt-token.service");
let RefreshTokenUseCase = class RefreshTokenUseCase {
    constructor(userRepository, refreshTokenRepository, jwtTokenService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenService = jwtTokenService;
    }
    async execute(refreshToken) {
        const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw new common_1.UnauthorizedException('Недействительный refresh token');
        }
        if (storedToken.isExpired()) {
            await this.refreshTokenRepository.deleteByToken(refreshToken);
            throw new common_1.UnauthorizedException('Refresh token истёк');
        }
        const user = await this.userRepository.findById(storedToken.userId);
        if (!user || !user.isActive) {
            await this.refreshTokenRepository.deleteByToken(refreshToken);
            throw new common_1.UnauthorizedException('Пользователь не найден или деактивирован');
        }
        await this.refreshTokenRepository.deleteByToken(refreshToken);
        const tokenPair = await this.jwtTokenService.generateTokenPair(user.id, user.email, user.role);
        await this.refreshTokenRepository.create({
            token: tokenPair.refreshToken,
            userId: user.id,
            expiresAt: this.jwtTokenService.getRefreshTokenExpirationDate(),
        });
        return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
        };
    }
};
exports.RefreshTokenUseCase = RefreshTokenUseCase;
exports.RefreshTokenUseCase = RefreshTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(refresh_token_repository_interface_1.REFRESH_TOKEN_REPOSITORY)),
    __param(2, (0, common_1.Inject)(jwt_token_service_1.JWT_TOKEN_SERVICE)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RefreshTokenUseCase);
//# sourceMappingURL=refresh-token.use-case.js.map