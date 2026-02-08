"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../infrastructure/database/prisma");
const controllers_1 = require("../presentation/controllers");
const repositories_1 = require("../infrastructure/database/repositories");
const hash_service_1 = require("../infrastructure/services/hash.service");
const repositories_2 = require("../domain/repositories");
const hash_service_2 = require("../infrastructure/services/hash.service");
const employee_1 = require("../application/use-cases/employee");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [controllers_1.EmployeeController],
        providers: [
            { provide: repositories_2.USER_REPOSITORY, useClass: repositories_1.UserRepository },
            { provide: repositories_2.ACCOUNT_REPOSITORY, useClass: repositories_1.AccountRepository },
            { provide: repositories_2.POINT_REPOSITORY, useClass: repositories_1.PointRepository },
            { provide: repositories_2.POINT_MEMBER_REPOSITORY, useClass: repositories_1.PointMemberRepository },
            { provide: hash_service_2.HASH_SERVICE, useClass: hash_service_1.HashService },
            employee_1.CreateEmployeeUseCase,
            employee_1.GetEmployeesUseCase,
            employee_1.AssignPointUseCase,
            employee_1.DeleteEmployeeUseCase,
            employee_1.GetPointEmployeesUseCase,
            employee_1.UnassignPointUseCase,
        ],
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map