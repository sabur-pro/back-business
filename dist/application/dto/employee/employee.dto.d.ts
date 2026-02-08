export declare class CreateEmployeeDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}
export declare class AssignPointDto {
    pointId: string;
}
export declare class EmployeeResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone?: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
}
export declare class PointAssignmentResponseDto {
    id: string;
    pointId: string;
    pointName: string;
    userId: string;
    role: string;
    createdAt: Date;
}
