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
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IPointMemberRepository,
    POINT_MEMBER_REPOSITORY,
} from '@domain/repositories/point-member.repository.interface';
import {
    IAuditLogRepository,
    AUDIT_LOG_REPOSITORY,
} from '@domain/repositories/audit-log.repository.interface';
import { ProductEntity } from '@domain/entities/product.entity';
import { AuditAction } from '@domain/entities/audit-log.entity';
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
        @Inject(AUDIT_LOG_REPOSITORY)
        private readonly auditLogRepository: IAuditLogRepository,
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

        // Capture old data before update
        const oldData: Record<string, any> = {};
        const newData: Record<string, any> = {};

        const fieldsToTrack = [
            'sku', 'photoOriginal', 'photo', 'sizeRange', 'boxCount', 'pairCount',
            'priceYuan', 'priceRub', 'totalYuan', 'totalRub', 'barcode', 'isActive',
        ] as const;

        for (const field of fieldsToTrack) {
            if ((dto as any)[field] !== undefined && (dto as any)[field] !== (product as any)[field]) {
                oldData[field] = (product as any)[field];
                newData[field] = (dto as any)[field];
            }
        }

        const updatedProduct = await this.productRepository.update(productId, {
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

        const hasPriceChanges = dto.priceYuan !== undefined || dto.priceRub !== undefined || dto.totalYuan !== undefined || dto.totalRub !== undefined;
        if (hasPriceChanges) {
            const currentSku = dto.sku ?? product.sku;
            await this.productRepository.updatePricesBySku(currentSku, product.accountId, {
                priceYuan: dto.priceYuan,
                priceRub: dto.priceRub,
                totalYuan: dto.totalYuan,
                totalRub: dto.totalRub,
            });
        }

        // Record audit log if there are actual changes
        if (Object.keys(oldData).length > 0) {
            await this.auditLogRepository.create({
                action: AuditAction.PRODUCT_UPDATED,
                entityType: 'PRODUCT',
                entityId: productId,
                userId,
                accountId: product.accountId,
                oldData,
                newData,
            });
        }

        return updatedProduct;
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

            const user = await this.userRepository.findById(userId);
            if (!user || !user.canAddProducts) {
                throw new ForbiddenException('Организатор не предоставил право управления товарами');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }
}
