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
exports.DeleteEmployeeUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const user_entity_1 = require("../../../domain/entities/user.entity");
let DeleteEmployeeUseCase = class DeleteEmployeeUseCase {
    constructor(userRepository, accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }
    async execute(organizerId, employeeId) {
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== user_entity_1.UserRole.ORGANIZER) {
            throw new common_1.ForbiddenException('Только организатор может удалять сотрудников');
        }
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            throw new common_1.ForbiddenException('У вас нет организации');
        }
        const accountId = accounts[0].id;
        const employee = await this.userRepository.findById(employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('Сотрудник не найден');
        }
        if (employee.accountId !== accountId) {
            throw new common_1.ForbiddenException('Сотрудник не принадлежит вашей организации');
        }
        await this.userRepository.delete(employeeId);
    }
};
exports.DeleteEmployeeUseCase = DeleteEmployeeUseCase;
exports.DeleteEmployeeUseCase = DeleteEmployeeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], DeleteEmployeeUseCase);
//# sourceMappingURL=delete-employee.use-case.js.map