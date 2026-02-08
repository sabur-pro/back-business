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
exports.UnassignPointUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const point_repository_interface_1 = require("../../../domain/repositories/point.repository.interface");
const point_member_repository_interface_1 = require("../../../domain/repositories/point-member.repository.interface");
const user_entity_1 = require("../../../domain/entities/user.entity");
let UnassignPointUseCase = class UnassignPointUseCase {
    constructor(userRepository, accountRepository, pointRepository, pointMemberRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.pointRepository = pointRepository;
        this.pointMemberRepository = pointMemberRepository;
    }
    async execute(organizerId, employeeId, pointId) {
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== user_entity_1.UserRole.ORGANIZER) {
            throw new common_1.ForbiddenException('Только организатор может снимать назначения');
        }
        const point = await this.pointRepository.findById(pointId);
        if (!point) {
            throw new common_1.NotFoundException('Точка не найдена');
        }
        const assignment = await this.pointMemberRepository.findByPointAndUser(pointId, employeeId);
        if (!assignment) {
            throw new common_1.NotFoundException('Назначение не найдено');
        }
        await this.pointMemberRepository.deleteByPointAndUser(pointId, employeeId);
    }
};
exports.UnassignPointUseCase = UnassignPointUseCase;
exports.UnassignPointUseCase = UnassignPointUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(point_repository_interface_1.POINT_REPOSITORY)),
    __param(3, (0, common_1.Inject)(point_member_repository_interface_1.POINT_MEMBER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UnassignPointUseCase);
//# sourceMappingURL=unassign-point.use-case.js.map