import { Inject, Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
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
import { UpdateProductDto } from '@application/dto/product';

@Injectable()
export class UpdateProductUseCase {
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

    async execute(userId: string, productId: string, dto: UpdateProductDto): Promise<ProductEntity> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new NotFoundException('Товар не найден');
        }

        // Check permissions based on product's accountId
        await this.checkPermissions(userId, user.role, product.accountId);

        // Check SKU uniqueness if changing (within same account + warehouse)
        if (dto.sku && dto.sku !== product.sku) {
            const existingProduct = await this.productRepository.findBySkuAndAccountId(dto.sku, product.accountId, product.warehouseId);
            if (existingProduct) {
                throw new ConflictException(`Товар с артикулом "${dto.sku}" уже существует на данном складе`);
            }
        }

        return this.productRepository.update(productId, {
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
            isActive: dto.isActive,
        });
    }

    private async checkPermissions(
        userId: string,
        userRole: UserRole,
        accountId: string,
    ): Promise<void> {
        if (userRole === UserRole.ORGANIZER) {
            // Verify organizer owns this account
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.accountId === accountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данному товару');
            }
            return;
        }

        if (userRole === UserRole.POINT_ADMIN) {
            // Check if point admin belongs to this account
            const memberships = await this.pointMemberRepository.findByUserId(userId);
            if (memberships.length === 0) {
                throw new ForbiddenException('Нет доступа к данному товару');
            }

            // Check if organizer granted canAddProducts permission
            const settings = await this.orgSettingsRepository.findByAccountId(accountId);
            if (!settings || !settings.canAddProducts) {
                throw new ForbiddenException('Организатор не предоставил право управления товарами');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }
}
