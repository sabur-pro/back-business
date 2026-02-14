import {
    Inject,
    Injectable,
    ForbiddenException,
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
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';

@Injectable()
export class RemoveShopEmployeeUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(SHOP_EMPLOYEE_REPOSITORY)
        private readonly shopEmployeeRepository: IShopEmployeeRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async execute(userId: string, shopId: string, employeeUserId: string): Promise<void> {
        // 1. Validate shop exists
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }

        // 2. Verify caller has access to the point
        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === shop.pointId);
        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        // 3. Check assignment exists
        const existing = await this.shopEmployeeRepository.findByShopAndUser(shopId, employeeUserId);
        if (!existing) {
            throw new NotFoundException('Сотрудник не назначен в этот магазин');
        }

        // 4. Remove
        await this.shopEmployeeRepository.deleteByShopAndUser(shopId, employeeUserId);
    }
}
