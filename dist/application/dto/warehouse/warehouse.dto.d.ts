export declare class CreateWarehouseDto {
    name: string;
    pointId: string;
    address?: string;
    description?: string;
}
export declare class UpdateWarehouseDto {
    name?: string;
    address?: string;
    description?: string;
    isActive?: boolean;
}
export declare class WarehouseResponseDto {
    id: string;
    name: string;
    pointId: string;
    address: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
