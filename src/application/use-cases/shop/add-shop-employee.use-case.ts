import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
    ConflictException,
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
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { ShopEmployeeEntity } from '@domain/entities/shop-employee.entity';
import { AddShopEmployeeDto } from '@application/dto/shop';

@Injectable()
export class AddShopEmployeeUseCase {
    constructor(
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(SHOP_EMPLOYEE_REPOSITORY)
        private readonly shopEmployeeRepository: IShopEmployeeRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async execute(userId: string, dto: AddShopEmployeeDto): Promise<ShopEmployeeEntity> {
        // 1. Validate shop exists and is type SHOP
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }
        if (shop.type !== WarehouseType.SHOP) {
            throw new BadRequestException('Указанный объект не является магазином');
        }

        // 2. Verify caller has access to the point
        const userPoints = await this.pointRepository.findByUserId(userId);
        const hasAccess = userPoints.some((p) => p.id === shop.pointId);
        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        // 3. Validate employee exists
        const employee = await this.userRepository.findById(dto.userId);
        if (!employee) {
            throw new NotFoundException('Сотрудник не найден');
        }

        // 4. Check if already assigned
        const existing = await this.shopEmployeeRepository.findByShopAndUser(dto.shopId, dto.userId);
        if (existing) {
            throw new ConflictException('Сотрудник уже назначен в этот магазин');
        }

        // 5. Create assignment
        return this.shopEmployeeRepository.create({
            warehouseId: dto.shopId,
            userId: dto.userId,
        });
    }
}
