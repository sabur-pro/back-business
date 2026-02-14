import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { UserRole } from '@domain/entities/user.entity';

@Injectable()
export class DeleteProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(POINT_MEMBER_REPOSITORY)
        private readonly pointMemberRepository: IPointMemberRepository,
    ) { }

    async execute(userId: string, productId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new NotFoundException('Товар не найден');
        }

        // Check permissions
        await this.checkPermissions(userId, user.role, product.accountId);

        await this.productRepository.delete(productId);
    }

    async executeMany(userId: string, productIds: string[]): Promise<{ deleted: number }> {
        if (!productIds || productIds.length === 0) {
            throw new BadRequestException('Необходимо указать хотя бы один ID товара');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Validate all products exist and belong to the same account
        const accountIds = new Set<string>();
        for (const id of productIds) {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new NotFoundException(`Товар с ID "${id}" не найден`);
            }
            accountIds.add(product.accountId);
        }

        // Check permissions for each account
        for (const accountId of accountIds) {
            await this.checkPermissions(userId, user.role, accountId);
        }

        const deleted = await this.productRepository.deleteMany(productIds);
        return { deleted };
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
