import { CreateEmployeeDto, AssignPointDto, EmployeeResponseDto, PointAssignmentResponseDto } from '@application/dto/employee';
import { CreateEmployeeUseCase, GetEmployeesUseCase, AssignPointUseCase, DeleteEmployeeUseCase, GetPointEmployeesUseCase, UnassignPointUseCase } from '@application/use-cases/employee';
export declare class EmployeeController {
    private readonly createEmployeeUseCase;
    private readonly getEmployeesUseCase;
    private readonly assignPointUseCase;
    private readonly deleteEmployeeUseCase;
    private readonly getPointEmployeesUseCase;
    private readonly unassignPointUseCase;
    constructor(createEmployeeUseCase: CreateEmployeeUseCase, getEmployeesUseCase: GetEmployeesUseCase, assignPointUseCase: AssignPointUseCase, deleteEmployeeUseCase: DeleteEmployeeUseCase, getPointEmployeesUseCase: GetPointEmployeesUseCase, unassignPointUseCase: UnassignPointUseCase);
    create(userId: string, dto: CreateEmployeeDto): Promise<EmployeeResponseDto>;
    getAll(userId: string): Promise<EmployeeResponseDto[]>;
    getByPoint(userId: string, pointId: string): Promise<EmployeeResponseDto[]>;
    assignPoint(userId: string, employeeId: string, dto: AssignPointDto): Promise<PointAssignmentResponseDto>;
    unassignPoint(userId: string, employeeId: string, dto: AssignPointDto): Promise<void>;
    delete(userId: string, employeeId: string): Promise<void>;
}
