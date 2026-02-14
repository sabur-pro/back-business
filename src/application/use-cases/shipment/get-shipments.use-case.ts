import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import {
    IShipmentRepository,
    SHIPMENT_REPOSITORY,
    PaginatedShipments,
} from '@domain/repositories/shipment.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IAccountRepository,
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { UserEntity, UserRole } from '@domain/entities/user.entity';
import { ShipmentEntity } from '@domain/entities/shipment.entity';
import { ShipmentSearchQueryDto } from '@application/dto/shipment';

@Injectable()
export class GetShipmentsUseCase {
    constructor(
        @Inject(SHIPMENT_REPOSITORY)
        private readonly shipmentRepository: IShipmentRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async getById(userId: string, shipmentId: string): Promise<any> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) {
            throw new NotFoundException('Отправка не найдена');
        }

        // Check access
        await this.checkAccessForView(user, shipment);

        // Strip prices for POINT_ADMIN
        if (user.role === UserRole.POINT_ADMIN) {
            return this.stripPrices(shipment);
        }

        return shipment;
    }

    async getOutgoing(
        userId: string,
        accountId: string,
        query: ShipmentSearchQueryDto,
    ): Promise<PaginatedShipments> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        await this.checkAccountAccessForOutgoing(user, accountId);

        const result = await this.shipmentRepository.findByAccountOutgoing(accountId, {
            page: query.page,
            limit: query.limit,
            status: query.status,
        });

        // Strip prices for POINT_ADMIN
        if (user.role === UserRole.POINT_ADMIN) {
            return {
                ...result,
                items: result.items.map((s) => this.stripPrices(s)),
            };
        }

        return result;
    }

    async getIncoming(
        userId: string,
        accountId: string,
        query: ShipmentSearchQueryDto,
    ): Promise<PaginatedShipments> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        await this.checkAccountAccessForIncoming(user, accountId);

        const result = await this.shipmentRepository.findByAccountIncoming(accountId, {
            page: query.page,
            limit: query.limit,
            status: query.status,
        });

        // Strip prices for POINT_ADMIN
        if (user.role === UserRole.POINT_ADMIN) {
            return {
                ...result,
                items: result.items.map((s) => this.stripPrices(s)),
            };
        }

        return result;
    }

    async getMyShipments(
        userId: string,
        query: ShipmentSearchQueryDto,
    ): Promise<PaginatedShipments> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(user.id);
            if (accounts.length === 0) {
                return { items: [], total: 0, page: 1, limit: 20, totalPages: 0 };
            }
            const accountIds = accounts.map((a) => a.id);
            return this.shipmentRepository.findByAccountIds(accountIds, {
                page: query.page,
                limit: query.limit,
                status: query.status,
            });
        }

        if (user.role === UserRole.POINT_ADMIN) {
            const points = await this.pointRepository.findByUserId(user.id);
            if (points.length === 0) {
                return { items: [], total: 0, page: 1, limit: 20, totalPages: 0 };
            }
            const pointIds = points.map((p) => p.id);
            const result = await this.shipmentRepository.findByPointIds(pointIds, {
                page: query.page,
                limit: query.limit,
                status: query.status,
            });

            return {
                ...result,
                items: result.items.map((s) => this.stripPrices(s)),
            };
        }

        throw new ForbiddenException('Недостаточно прав');
    }

    private stripPrices(shipment: ShipmentEntity): any {
        return {
            ...shipment,
            totalYuan: 0,
            totalRub: 0,
            items: shipment.items.map((item) => ({
                ...item,
                priceYuan: 0,
                priceRub: 0,
                totalYuan: 0,
                totalRub: 0,
            })),
        };
    }

    private async checkAccessForView(
        user: UserEntity,
        shipment: ShipmentEntity,
    ): Promise<void> {
        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(user.id);
            const accountIds = accounts.map((a) => a.id);
            const hasAccess = accountIds.includes(shipment.fromAccountId) || accountIds.includes(shipment.toAccountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данной отправке');
            }
            return;
        }

        if (user.role === UserRole.POINT_ADMIN) {
            const points = await this.pointRepository.findByUserId(user.id);
            const pointIds = points.map((p) => p.id);
            const isSenderPoint = pointIds.includes(shipment.fromPointId);
            const isReceiverPoint = pointIds.includes(shipment.toPointId);
            if (!isSenderPoint && !isReceiverPoint) {
                throw new ForbiddenException('Нет доступа к данной отправке');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }

    private async checkAccountAccessForOutgoing(
        user: UserEntity,
        accountId: string,
    ): Promise<void> {
        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(user.id);
            const hasAccess = accounts.some((a) => a.id === accountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данному аккаунту');
            }
            return;
        }

        if (user.role === UserRole.POINT_ADMIN) {
            if (user.accountId !== accountId) {
                throw new ForbiddenException('Нет доступа к данному аккаунту');
            }
            if (!user.canCreateShipment) {
                throw new ForbiddenException('У вас нет разрешения на просмотр исходящих отправок');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }

    private async checkAccountAccessForIncoming(
        user: UserEntity,
        accountId: string,
    ): Promise<void> {
        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(user.id);
            const hasAccess = accounts.some((a) => a.id === accountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данному аккаунту');
            }
            return;
        }

        if (user.role === UserRole.POINT_ADMIN) {
            if (user.accountId !== accountId) {
                throw new ForbiddenException('Нет доступа к данному аккаунту');
            }
            if (!user.canReceiveShipment) {
                throw new ForbiddenException('У вас нет разрешения на просмотр входящих отправок');
            }
            return;
        }

        throw new ForbiddenException('Недостаточно прав');
    }
}
