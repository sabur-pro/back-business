import { CreateEmployeeDto, AssignPointDto, UpdateEmployeePermissionsDto, UpdateEmployeeDataDto, EmployeeResponseDto, PointAssignmentResponseDto } from '@application/dto/employee';
import { CreateEmployeeUseCase, GetEmployeesUseCase, AssignPointUseCase, DeleteEmployeeUseCase, GetPointEmployeesUseCase, UnassignPointUseCase, UpdateEmployeePermissionsUseCase, UpdateEmployeeDataUseCase } from '@application/use-cases/employee';
export declare class EmployeeController {
    private readonly createEmployeeUseCase;
    private readonly getEmployeesUseCase;
    private readonly assignPointUseCase;
    private readonly deleteEmployeeUseCase;
    private readonly getPointEmployeesUseCase;
    private readonly unassignPointUseCase;
    private readonly updateEmployeePermissionsUseCase;
    private readonly updateEmployeeDataUseCase;
    constructor(createEmployeeUseCase: CreateEmployeeUseCase, getEmployeesUseCase: GetEmployeesUseCase, assignPointUseCase: AssignPointUseCase, deleteEmployeeUseCase: DeleteEmployeeUseCase, getPointEmployeesUseCase: GetPointEmployeesUseCase, unassignPointUseCase: UnassignPointUseCase, updateEmployeePermissionsUseCase: UpdateEmployeePermissionsUseCase, updateEmployeeDataUseCase: UpdateEmployeeDataUseCase);
    create(userId: string, dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
    getAll(userId: string): Promise<EmployeeResponseDto[]>;
    getByPoint(userId: string, pointId: string): Promise<EmployeeResponseDto[]>;
    assignPoint(userId: string, employeeId: string, dto: AssignPointDto): Promise<PointAssignmentResponseDto>;
    unassignPoint(userId: string, employeeId: string, dto: AssignPointDto): Promise<void>;
    updatePermissions(userId: string, employeeId: string, dto: UpdateEmployeePermissionsDto): Promise<EmployeeResponseDto>;
    updateData(userId: string, employeeId: string, dto: UpdateEmployeeDataDto): Promise<EmployeeResponseDto>;
    delete(userId: string, employeeId: string): Promise<void>;
}
