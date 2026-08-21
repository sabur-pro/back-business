import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IAuditLogRepository,
    CreateAuditLogData,
    AuditLogSearchParams,
    PaginatedAuditLogs,
} from '@domain/repositories/audit-log.repository.interface';
import { AuditLogEntity } from '@domain/entities/audit-log.entity';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
    constructor(private readonly prisma: PrismaService) { }

    private toEntity(log: any): AuditLogEntity {
        return AuditLogEntity.create({
            id: log.id,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            userId: log.userId,
            accountId: log.accountId,
            oldData: log.oldData,
            newData: log.newData,
            metadata: log.metadata,
            createdAt: log.createdAt,
            userName: log.user
                ? `${log.user.firstName} ${log.user.lastName}`
                : undefined,
        });
    }

    async create(data: CreateAuditLogData): Promise<AuditLogEntity> {
        const log = await this.prisma.auditLog.create({
            data: {
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                userId: data.userId,
                accountId: data.accountId,
                oldData: data.oldData ?? undefined,
                newData: data.newData ?? undefined,
                metadata: data.metadata ?? undefined,
            },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
        });

        return this.toEntity(log);
    }

    async createMany(data: CreateAuditLogData[]): Promise<void> {
        await this.prisma.auditLog.createMany({
            data: data.map((d) => ({
                action: d.action,
                entityType: d.entityType,
                entityId: d.entityId,
                userId: d.userId,
                accountId: d.accountId,
                oldData: d.oldData ?? undefined,
                newData: d.newData ?? undefined,
                metadata: d.metadata ?? undefined,
            })),
        });
    }

    async findByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]> {
        const logs = await this.prisma.auditLog.findMany({
            where: { entityType, entityId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
        });

        return logs.map((l) => this.toEntity(l));
    }

    async findByAccount(
        accountId: string,
        params: AuditLogSearchParams,
    ): Promise<PaginatedAuditLogs> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = { accountId };
        if (params.action) {
            where.action = params.action;
        }
        if (params.entityType) {
            where.entityType = params.entityType;
        }

        const [items, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { firstName: true, lastName: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);

        return {
            items: items.map((l) => this.toEntity(l)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
