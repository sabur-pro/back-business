"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const auth_controller_1 = require("../presentation/controllers/auth.controller");
const jwt_strategy_1 = require("../presentation/strategies/jwt.strategy");
const jwt_auth_guard_1 = require("../presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("../presentation/guards/roles.guard");
const auth_1 = require("../application/use-cases/auth");
const user_repository_1 = require("../infrastructure/database/repositories/user.repository");
const refresh_token_repository_1 = require("../infrastructure/database/repositories/refresh-token.repository");
const account_repository_1 = require("../infrastructure/database/repositories/account.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const refresh_token_repository_interface_1 = require("../domain/repositories/refresh-token.repository.interface");
const account_repository_interface_1 = require("../domain/repositories/account.repository.interface");
const hash_service_1 = require("../infrastructure/services/hash.service");
const jwt_token_service_1 = require("../infrastructure/services/jwt-token.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            jwt_strategy_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: user_repository_interface_1.USER_REPOSITORY,
                useClass: user_repository_1.UserRepository,
            },
            {
                provide: refresh_token_repository_interface_1.REFRESH_TOKEN_REPOSITORY,
                useClass: refresh_token_repository_1.RefreshTokenRepository,
            },
            {
                provide: account_repository_interface_1.ACCOUNT_REPOSITORY,
                useClass: account_repository_1.AccountRepository,
            },
            {
                provide: hash_service_1.HASH_SERVICE,
                useClass: hash_service_1.HashService,
            },
            {
                provide: jwt_token_service_1.JWT_TOKEN_SERVICE,
                useClass: jwt_token_service_1.JwtTokenService,
            },
            auth_1.RegisterUseCase,
            auth_1.LoginUseCase,
            auth_1.RefreshTokenUseCase,
            auth_1.LogoutUseCase,
            auth_1.GetMeUseCase,
        ],
        exports: [user_repository_interface_1.USER_REPOSITORY, account_repository_interface_1.ACCOUNT_REPOSITORY],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map