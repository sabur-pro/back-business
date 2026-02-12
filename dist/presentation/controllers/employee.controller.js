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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../decorators");
const user_entity_1 = require("../../domain/entities/user.entity");
const employee_1 = require("../../application/dto/employee");
const employee_2 = require("../../application/use-cases/employee");
let EmployeeController = class EmployeeController {
    constructor(createEmployeeUseCase, getEmployeesUseCase, assignPointUseCase, deleteEmployeeUseCase, getPointEmployeesUseCase, unassignPointUseCase, updateEmployeePermissionsUseCase) {
        this.createEmployeeUseCase = createEmployeeUseCase;
        this.getEmployeesUseCase = getEmployeesUseCase;
        this.assignPointUseCase = assignPointUseCase;
        this.deleteEmployeeUseCase = deleteEmployeeUseCase;
        this.getPointEmployeesUseCase = getPointEmployeesUseCase;
        this.unassignPointUseCase = unassignPointUseCase;
        this.updateEmployeePermissionsUseCase = updateEmployeePermissionsUseCase;
    }
    async create(userId, dto) {
        return this.createEmployeeUseCase.execute(userId, dto);
    }
    async getAll(userId) {
        return this.getEmployeesUseCase.execute(userId);
    }
    async getByPoint(userId, pointId) {
        return this.getPointEmployeesUseCase.execute(userId, pointId);
    }
    async assignPoint(userId, employeeId, dto) {
        return this.assignPointUseCase.execute(userId, employeeId, dto.pointId);
    }
    async unassignPoint(userId, employeeId, dto) {
        return this.unassignPointUseCase.execute(userId, employeeId, dto.pointId);
    }
    async updatePermissions(userId, employeeId, dto) {
        return this.updateEmployeePermissionsUseCase.execute(userId, employeeId, dto);
    }
    async delete(userId, employeeId) {
        return this.deleteEmployeeUseCase.execute(userId, employeeId);
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создать сотрудника' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Сотрудник создан', type: employee_1.EmployeeResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить список сотрудников' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список сотрудников', type: [employee_1.EmployeeResponseDto] }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('point/:pointId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить сотрудников точки' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список сотрудников точки', type: [employee_1.EmployeeResponseDto] }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('pointId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getByPoint", null);
__decorate([
    (0, common_1.Post)(':employeeId/assign-point'),
    (0, swagger_1.ApiOperation)({ summary: 'Назначить сотрудника на точку' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Назначение создано', type: employee_1.PointAssignmentResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('employeeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employee_1.AssignPointDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "assignPoint", null);
__decorate([
    (0, common_1.Delete)(':employeeId/unassign-point'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Снять сотрудника с точки' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Назначение удалено' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('employeeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employee_1.AssignPointDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "unassignPoint", null);
__decorate([
    (0, common_1.Put)(':employeeId/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить разрешения сотрудника' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Разрешения обновлены', type: employee_1.EmployeeResponseDto }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('employeeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employee_1.UpdateEmployeePermissionsDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updatePermissions", null);
__decorate([
    (0, common_1.Delete)(':employeeId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить сотрудника' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Сотрудник удалён' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Нет доступа' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Сотрудник не найден' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "delete", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, swagger_1.ApiTags)('Сотрудники'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, decorators_1.Roles)(user_entity_1.UserRole.ORGANIZER),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employee_2.CreateEmployeeUseCase,
        employee_2.GetEmployeesUseCase,
        employee_2.AssignPointUseCase,
        employee_2.DeleteEmployeeUseCase,
        employee_2.GetPointEmployeesUseCase,
        employee_2.UnassignPointUseCase,
        employee_2.UpdateEmployeePermissionsUseCase])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map