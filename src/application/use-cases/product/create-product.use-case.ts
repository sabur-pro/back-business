import { Inject, Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import {
    IProductRepository,
    PRODUCT_REPOSITORY,
} from '@domain/repositories/product.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    IOrgSettingsRepository,
    ORG_SETTINGS_REPOSITORY,
} from '@domain/repositories/org-settings.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IPointMemberRepository,
    POINT_MEMBER_REPOSITORY,
} from '@domain/repositories/point-member.repository.interface';
import { ProductEntity } from '@domain/entities/product.entity';
import { UserRole } from '@domain/entities/user.entity';
import { CreateProductDto } from '@application/dto/product';

@Injectable()
export class CreateProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(POINT_MEMBER_REPOSITORY)
        private readonly pointMemberRepository: IPointMemberRepository,
        @Inject(ORG_SETTINGS_REPOSITORY)
        private readonly orgSettingsRepository: IOrgSettingsRepository,
    ) { }

    async execute(userId: string, dto: CreateProductDto): Promise<ProductEntity> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        const point = await this.pointRepository.findById(dto.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        // Determine accountId from point
        const accountId = point.accountId;

        // Check permissions
        await this.checkPermissions(userId, user.role, dto.pointId, accountId);

        // Check SKU uniqueness within account
        const existingProduct = await this.productRepository.findBySkuAndAccountId(dto.sku, accountId);
        if (existingProduct) {
            throw new ConflictException(`Товар с артикулом "${dto.sku}" уже существует в данном аккаунте`);
        }

        return this.productRepository.create({
            sku: dto.sku,
            photoOriginal: dto.photoOriginal,
            photo: dto.photo,
            sizeRange: dto.sizeRange,
            boxCount: dto.boxCount,
            pairCount: dto.pairCount,
            priceYuan: dto.priceYuan,
            priceRub: dto.priceRub,
            totalYuan: dto.totalYuan,
            totalRub: dto.totalRub,
            barcode: dto.barcode,
            accountId,
        });
    }

    private async checkPermissions(
        userId: string,
        userRole: UserRole,
        pointId: string,
        accountId: string,
    ): Promise<void> {
        if (userRole === UserRole.ORGANIZER) {
            // Organizer must own the account that owns the point
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.id === pointId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данной точке');
            }
            return;
        }

        if (userRole === UserRole.POINT_ADMIN) {
            // Check if point admin is assigned to this point
            const membership = await this.pointMemberRepository.findByPointAndUser(pointId, userId);
            if (!membership) {
                throw new ForbiddenException('Нет доступа к данной точке');
            }

            // Check if organizer granted canAddProducts permission
            const settings = await this.orgSettingsRepository.findByAccountId(accountId);
            if (!settings || !settings.canAddProducts) {
                throw new ForbiddenException('Организатор не предоставил право добавления товаров');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }
}
