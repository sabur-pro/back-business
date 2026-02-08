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
exports.AssignPointUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const point_member_repository_interface_1 = require("../../../domain/repositories/point-member.repository.interface");
const point_repository_interface_1 = require("../../../domain/repositories/point.repository.interface");
const user_entity_1 = require("../../../domain/entities/user.entity");
let AssignPointUseCase = class AssignPointUseCase {
    constructor(userRepository, accountRepository, pointMemberRepository, pointRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.pointMemberRepository = pointMemberRepository;
        this.pointRepository = pointRepository;
    }
    async execute(organizerId, employeeId, pointId) {
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== user_entity_1.UserRole.ORGANIZER) {
            throw new common_1.ForbiddenException('Только организатор может назначать сотрудников на точки');
        }
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            throw new common_1.ForbiddenException('У вас нет организации');
        }
        const accountId = accounts[0].id;
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new common_1.NotFoundException('Точка не найдена');
        }
        if (point.accountId !== accountId) {
            throw new common_1.ForbiddenException('Точка не принадлежит вашей организации');
        }
        const employee = await this.userRepository.findById(employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('Сотрудник не найден');
        }
        if (employee.accountId !== accountId) {
            throw new common_1.ForbiddenException('Сотрудник не принадлежит вашей организации');
        }
        const existingAssignment = await this.pointMemberRepository.findByPointAndUser(pointId, employeeId);
        if (existingAssignment) {
            return {
                id: existingAssignment.id,
                pointId: existingAssignment.pointId,
                pointName: existingAssignment.pointName || point.name,
                userId: existingAssignment.userId,
                role: existingAssignment.role,
                createdAt: existingAssignment.createdAt,
            };
        }
        const assignment = await this.pointMemberRepository.create({
            pointId,
            userId: employeeId,
            role: user_entity_1.UserRole.POINT_ADMIN,
        });
        return {
            id: assignment.id,
            pointId: assignment.pointId,
            pointName: assignment.pointName || point.name,
            userId: assignment.userId,
            role: assignment.role,
            createdAt: assignment.createdAt,
        };
    }
};
exports.AssignPointUseCase = AssignPointUseCase;
exports.AssignPointUseCase = AssignPointUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(point_member_repository_interface_1.POINT_MEMBER_REPOSITORY)),
    __param(3, (0, common_1.Inject)(point_repository_interface_1.POINT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AssignPointUseCase);
//# sourceMappingURL=assign-point.use-case.js.map