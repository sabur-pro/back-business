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
exports.JwtTokenService = exports.JWT_TOKEN_SERVICE = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
exports.JWT_TOKEN_SERVICE = Symbol('IJwtTokenService');
let JwtTokenService = class JwtTokenService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async generateTokenPair(userId, email, role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId, email, role),
            Promise.resolve(this.generateRefreshToken()),
        ]);
        return { accessToken, refreshToken };
    }
    async generateAccessToken(userId, email, role) {
        const payload = {
            sub: userId,
            email: email,
            role: role,
        };
        return this.jwtService.signAsync(payload);
    }
    generateRefreshToken() {
        return (0, uuid_1.v4)();
    }
    async verifyAccessToken(token) {
        return this.jwtService.verifyAsync(token);
    }
    getRefreshTokenExpirationDate() {
        const refreshExpiration = this.configService.get('JWT_REFRESH_EXPIRATION', '7d');
        const ms = this.parseExpiration(refreshExpiration);
        return new Date(Date.now() + ms);
    }
    parseExpiration(expiration) {
        const match = expiration.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 7 * 24 * 60 * 60 * 1000;
        }
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
            case 's':
                return value * 1000;
            case 'm':
                return value * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            default:
                return 7 * 24 * 60 * 60 * 1000;
        }
    }
};
exports.JwtTokenService = JwtTokenService;
exports.JwtTokenService = JwtTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtTokenService);
//# sourceMappingURL=jwt-token.service.js.map