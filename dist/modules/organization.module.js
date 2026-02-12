"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../infrastructure/database/prisma");
const controllers_1 = require("../presentation/controllers");
const repositories_1 = require("../infrastructure/database/repositories");
const repositories_2 = require("../domain/repositories");
const organization_1 = require("../application/use-cases/organization");
let OrganizationModule = class OrganizationModule {
};
exports.OrganizationModule = OrganizationModule;
exports.OrganizationModule = OrganizationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [controllers_1.OrganizationController],
        providers: [
            {
                provide: repositories_2.ACCOUNT_REPOSITORY,
                useClass: repositories_1.AccountRepository,
            },
            {
                provide: repositories_2.POINT_REPOSITORY,
                useClass: repositories_1.PointRepository,
            },
            {
                provide: repositories_2.USER_REPOSITORY,
                useClass: repositories_1.UserRepository,
            },
            organization_1.CreateAccountUseCase,
            organization_1.GetAccountsUseCase,
            organization_1.GetAllAccountsUseCase,
            organization_1.CreatePointUseCase,
            organization_1.GetPointsUseCase,
            organization_1.UpdatePointUseCase,
        ],
        exports: [repositories_2.ACCOUNT_REPOSITORY, repositories_2.POINT_REPOSITORY],
    })
], OrganizationModule);
//# sourceMappingURL=organization.module.js.map