import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import {
    IAuditLogRepository,
    AUDIT_LOG_REPOSITORY,
    AuditLogSearchParams,
    PaginatedAuditLogs,
} from '@domain/repositories/audit-log.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { AuditLogEntity, AuditAction } from '@domain/entities/audit-log.entity';
import { UserRole } from '@domain/entities/user.entity';

@Injectable()
export class GetAuditLogsUseCase {
    constructor(
        @Inject(AUDIT_LOG_REPOSITORY)
        private readonly auditLogRepository: IAuditLogRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async getByEntity(
        userId: string,
        entityType: string,
        entityId: string,
    ): Promise<AuditLogEntity[]> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        return this.auditLogRepository.findByEntity(entityType, entityId);
    }

    async getByAccount(
        userId: string,
        accountId: string,
        params: {
            page?: number;
            limit?: number;
            action?: string;
            entityType?: string;
        },
    ): Promise<PaginatedAuditLogs> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        // Check access
        if (user.role === UserRole.ORGANIZER) {
            const userPoints = await this.pointRepository.findByUserId(userId);
            const hasAccess = userPoints.some((p) => p.accountId === accountId);
            if (!hasAccess) {
                throw new ForbiddenException('Нет доступа к данной организации');
            }
        }

        const searchParams: AuditLogSearchParams = {
            page: params.page,
            limit: params.limit,
            action: params.action as AuditAction | undefined,
            entityType: params.entityType,
        };

        return this.auditLogRepository.findByAccount(accountId, searchParams);
    }
}
