import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../decorators';
import { UserRole } from '@/domain/entities/user.entity';
import {
    CreateEmployeeDto,
    AssignPointDto,
    UpdateEmployeePermissionsDto,
    EmployeeResponseDto,
    PointAssignmentResponseDto,
} from '@application/dto/employee';
import {
    CreateEmployeeUseCase,
    GetEmployeesUseCase,
    AssignPointUseCase,
    DeleteEmployeeUseCase,
    GetPointEmployeesUseCase,
    UnassignPointUseCase,
    UpdateEmployeePermissionsUseCase,
} from '@application/use-cases/employee';

@ApiTags('Сотрудники')
@ApiBearerAuth()
@Roles(UserRole.ORGANIZER)
@Controller('employees')
export class EmployeeController {
    constructor(
        private readonly createEmployeeUseCase: CreateEmployeeUseCase,
        private readonly getEmployeesUseCase: GetEmployeesUseCase,
        private readonly assignPointUseCase: AssignPointUseCase,
        private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
        private readonly getPointEmployeesUseCase: GetPointEmployeesUseCase,
        private readonly unassignPointUseCase: UnassignPointUseCase,
        private readonly updateEmployeePermissionsUseCase: UpdateEmployeePermissionsUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать сотрудника' })
    @ApiResponse({ status: 201, description: 'Сотрудник создан', type: EmployeeResponseDto })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateEmployeeDto,
    ): Promise<EmployeeResponseDto> {
        return this.createEmployeeUseCase.execute(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список сотрудников' })
    @ApiResponse({ status: 200, description: 'Список сотрудников', type: [EmployeeResponseDto] })
    async getAll(@CurrentUser('id') userId: string): Promise<EmployeeResponseDto[]> {
        return this.getEmployeesUseCase.execute(userId);
    }

    @Get('point/:pointId')
    @ApiOperation({ summary: 'Получить сотрудников точки' })
    @ApiResponse({ status: 200, description: 'Список сотрудников точки', type: [EmployeeResponseDto] })
    async getByPoint(
        @CurrentUser('id') userId: string,
        @Param('pointId') pointId: string,
    ): Promise<EmployeeResponseDto[]> {
        return this.getPointEmployeesUseCase.execute(userId, pointId);
    }

    @Post(':employeeId/assign-point')
    @ApiOperation({ summary: 'Назначить сотрудника на точку' })
    @ApiResponse({ status: 201, description: 'Назначение создано', type: PointAssignmentResponseDto })
    async assignPoint(
        @CurrentUser('id') userId: string,
        @Param('employeeId') employeeId: string,
        @Body() dto: AssignPointDto,
    ): Promise<PointAssignmentResponseDto> {
        return this.assignPointUseCase.execute(userId, employeeId, dto.pointId);
    }

    @Delete(':employeeId/unassign-point')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Снять сотрудника с точки' })
    @ApiResponse({ status: 204, description: 'Назначение удалено' })
    async unassignPoint(
        @CurrentUser('id') userId: string,
        @Param('employeeId') employeeId: string,
        @Body() dto: AssignPointDto,
    ): Promise<void> {
        return this.unassignPointUseCase.execute(userId, employeeId, dto.pointId);
    }

    @Put(':employeeId/permissions')
    @ApiOperation({ summary: 'Обновить разрешения сотрудника' })
    @ApiResponse({ status: 200, description: 'Разрешения обновлены', type: EmployeeResponseDto })
    async updatePermissions(
        @CurrentUser('id') userId: string,
        @Param('employeeId') employeeId: string,
        @Body() dto: UpdateEmployeePermissionsDto,
    ): Promise<EmployeeResponseDto> {
        return this.updateEmployeePermissionsUseCase.execute(userId, employeeId, dto);
    }

    @Delete(':employeeId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить сотрудника' })
    @ApiResponse({ status: 204, description: 'Сотрудник удалён' })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
    async delete(
        @CurrentUser('id') userId: string,
        @Param('employeeId') employeeId: string,
    ): Promise<void> {
        return this.deleteEmployeeUseCase.execute(userId, employeeId);
    }
}
