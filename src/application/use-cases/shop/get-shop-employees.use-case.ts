import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IShopEmployeeRepository,
    SHOP_EMPLOYEE_REPOSITORY,
} from '@domain/repositories/shop-employee.repository.interface';
import { ShopEmployeeEntity } from '@domain/entities/shop-employee.entity';

@Injectable()
export class GetShopEmployeesUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(SHOP_EMPLOYEE_REPOSITORY)
        private readonly shopEmployeeRepository: IShopEmployeeRepository,
    ) { }

    async executeByShopId(shopId: string): Promise<ShopEmployeeEntity[]> {
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }

        return this.shopEmployeeRepository.findByShopId(shopId);
    }

    async executeByUserId(userId: string): Promise<ShopEmployeeEntity[]> {
        return this.shopEmployeeRepository.findByUserId(userId);
    }
}
