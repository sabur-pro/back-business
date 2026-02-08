import { CreateWarehouseDto, UpdateWarehouseDto, WarehouseResponseDto } from '@application/dto/warehouse';
import { CreateWarehouseUseCase, GetWarehousesUseCase, UpdateWarehouseUseCase, DeleteWarehouseUseCase } from '@application/use-cases/warehouse';
export declare class WarehouseController {
    private readonly createWarehouseUseCase;
    private readonly getWarehousesUseCase;
    private readonly updateWarehouseUseCase;
    private readonly deleteWarehouseUseCase;
    constructor(createWarehouseUseCase: CreateWarehouseUseCase, getWarehousesUseCase: GetWarehousesUseCase, updateWarehouseUseCase: UpdateWarehouseUseCase, deleteWarehouseUseCase: DeleteWarehouseUseCase);
    create(userId: string, dto: CreateWarehouseDto): Promise<WarehouseResponseDto>;
    getAll(userId: string): Promise<WarehouseResponseDto[]>;
    getByPoint(pointId: string): Promise<WarehouseResponseDto[]>;
    update(userId: string, id: string, dto: UpdateWarehouseDto): Promise<WarehouseResponseDto>;
    delete(userId: string, id: string): Promise<void>;
}
