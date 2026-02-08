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
exports.GetEmployeesUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
let GetEmployeesUseCase = class GetEmployeesUseCase {
    constructor(userRepository, accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }
    async execute(organizerId) {
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            return [];
        }
        const accountId = accounts[0].id;
        const employees = await this.userRepository.findByAccountId(accountId);
        return employees.map(employee => ({
            id: employee.id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fullName: employee.fullName,
            phone: employee.phone || undefined,
            role: employee.role,
            isActive: employee.isActive,
            createdAt: employee.createdAt,
        }));
    }
};
exports.GetEmployeesUseCase = GetEmployeesUseCase;
exports.GetEmployeesUseCase = GetEmployeesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], GetEmployeesUseCase);
//# sourceMappingURL=get-employees.use-case.js.map