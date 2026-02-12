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
exports.CreateEmployeeUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_interface_1 = require("../../../domain/repositories/user.repository.interface");
const account_repository_interface_1 = require("../../../domain/repositories/account.repository.interface");
const hash_service_1 = require("../../../infrastructure/services/hash.service");
const user_entity_1 = require("../../../domain/entities/user.entity");
let CreateEmployeeUseCase = class CreateEmployeeUseCase {
    constructor(userRepository, accountRepository, hashService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.hashService = hashService;
    }
    async execute(organizerId, dto) {
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== user_entity_1.UserRole.ORGANIZER) {
            throw new common_1.ForbiddenException('Только организатор может создавать сотрудников');
        }
        const accounts = await this.accountRepository.findByOwnerId(organizerId);
        if (accounts.length === 0) {
            throw new common_1.BadRequestException('У вас нет организации');
        }
        const accountId = accounts[0].id;
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Пользователь с таким email уже существует');
        }
        const hashedPassword = await this.hashService.hash(dto.password);
        const employee = await this.userRepository.create({
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            role: user_entity_1.UserRole.POINT_ADMIN,
            accountId: accountId,
            isActive: true,
        });
        return {
            id: employee.id,
            email: employee.email,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fullName: employee.fullName,
            phone: employee.phone || undefined,
            role: employee.role,
            canCreateShipment: employee.canCreateShipment,
            canReceiveShipment: employee.canReceiveShipment,
            isActive: employee.isActive,
            createdAt: employee.createdAt,
        };
    }
};
exports.CreateEmployeeUseCase = CreateEmployeeUseCase;
exports.CreateEmployeeUseCase = CreateEmployeeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(account_repository_interface_1.ACCOUNT_REPOSITORY)),
    __param(2, (0, common_1.Inject)(hash_service_1.HASH_SERVICE)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateEmployeeUseCase);
//# sourceMappingURL=create-employee.use-case.js.map