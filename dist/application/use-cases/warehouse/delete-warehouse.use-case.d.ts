import { IWarehouseRepository } from '@domain/repositories/warehouse.repository.interface';
export declare class DeleteWarehouseUseCase {
    private readonly warehouseRepository;
    constructor(warehouseRepository: IWarehouseRepository);
    execute(userId: string, warehouseId: string): Promise<void>;
}
