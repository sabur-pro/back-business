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
exports.RegisterUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const refresh_token_repository_interface_1 = require("../../../domain/repositories/refresh-token.repository.interface");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const hash_service_1 = require("../../../infrastructure/services/hash.service");
const jwt_token_service_1 = require("../../../infrastructure/services/jwt-token.service");
const user_entity_1 = require("../../../domain/entities/user.entity");
let RegisterUseCase = class RegisterUseCase {
    constructor(userRepository, refreshTokenRepository, accountRepository, hashService, jwtTokenService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.accountRepository = accountRepository;
        this.hashService = hashService;
        this.jwtTokenService = jwtTokenService;
    }
    async execute(dto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        const hashedPassword = await this.hashService.hash(dto.password);
        const user = await this.userRepository.create({
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone || null,
            role: user_entity_1.UserRole.ORGANIZER,
            isActive: true,
        });
        const account = await this.accountRepository.create({
            name: `Организация ${user.firstName}`,
            ownerId: user.id,
        });
        await this.userRepository.update(user.id, { accountId: account.id });
        const tokenPair = await this.jwtTokenService.generateTokenPair(user.id, user.email, user.role);
        await this.refreshTokenRepository.create({
            token: tokenPair.refreshToken,
            userId: user.id,
            expiresAt: this.jwtTokenService.getRefreshTokenExpirationDate(),
        });
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            phone: user.phone || undefined,
            role: user.role,
            accountId: account.id,
            canAddProducts: user.canAddProducts,
            canManageCounterparties: user.canManageCounterparties,
        };
        return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: userResponse,
        };
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(refresh_token_repository_interface_1.REFRESH_TOKEN_REPOSITORY)),
    __param(2, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __param(3, (0, common_1.Inject)(hash_service_1.HASH_SERVICE)),
    __param(4, (0, common_1.Inject)(jwt_token_service_1.JWT_TOKEN_SERVICE)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RegisterUseCase);
//# sourceMappingURL=register.use-case.js.map