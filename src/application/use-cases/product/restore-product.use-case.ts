import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
    IAuditLogRepository,
    AUDIT_LOG_REPOSITORY,
} from '@domain/repositories/audit-log.repository.interface';
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
import { ProductEntity } from '@domain/entities/product.entity';
import { AuditAction } from '@domain/entities/audit-log.entity';
import { UserRole } from '@domain/entities/user.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

@Injectable()
export class RestoreProductUseCase {
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
        private readonly prisma: PrismaService,
    ) { }

    async execute(userId: string, productId: string): Promise<ProductEntity> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Find the deleted product (bypassing soft-delete filter)
        const product = await this.prisma.product.findFirst({
            where: { id: productId, deletedAt: { not: null } },
        });

        if (!product) {
            throw new NotFoundException('Удалённый товар не найден');
        }

        // Check permissions
        await this.checkPermissions(userId, user.role, product.accountId);

        // Restore the product
        const restored = await (this.productRepository as any).restore(productId);

        // Record audit log
        await this.auditLogRepository.create({
            action: AuditAction.PRODUCT_RESTORED,
            entityType: 'PRODUCT',
            entityId: productId,
            userId,
            accountId: product.accountId,
            newData: {
                sku: product.sku,
                boxCount: product.boxCount,
                pairCount: product.pairCount,
            },
        });

        return restored;
    }

    private async checkPermissions(
        userId: string,
        userRole: UserRole,
        accountId: string,
    ): Promise<void> {
        if (userRole === UserRole.ORGANIZER) {
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.accountId === accountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данному товару');
            }
            return;
        }

        if (userRole === UserRole.POINT_ADMIN) {
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
