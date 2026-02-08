import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';

@Injectable()
export class DeleteWarehouseUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
    ) { }

    async execute(userId: string, warehouseId: string): Promise<void> {
        // Verify warehouse exists and user has access
        const userWarehouses = await this.warehouseRepository.findByUserId(userId);
        const hasAccess = userWarehouses.some((w) => w.id === warehouseId);

        if (!hasAccess) {
            const exists = await this.warehouseRepository.findById(warehouseId);
            if (!exists) {
                throw new NotFoundException('Склад не найден');
            }
            throw new ForbiddenException('Нет доступа к данному складу');
        }

        await this.warehouseRepository.delete(warehouseId);
    }
}
