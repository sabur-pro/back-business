import { AuditLogEntity, AuditAction } from '../entities/audit-log.entity';

export interface CreateAuditLogData {
    action: AuditAction;
    entityType: string;
    entityId: string;
    userId: string;
    accountId: string;
    oldData?: any | null;
    newData?: any | null;
    metadata?: any | null;
}

export interface AuditLogSearchParams {
    page?: number;
    limit?: number;
    action?: AuditAction;
    entityType?: string;
}

export interface PaginatedAuditLogs {
    items: AuditLogEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IAuditLogRepository {
    create(data: CreateAuditLogData): Promise<AuditLogEntity>;
    createMany(data: CreateAuditLogData[]): Promise<void>;
    findByEntity(entityType: string, entityId: string): Promise<AuditLogEntity[]>;
    findByAccount(accountId: string, params: AuditLogSearchParams): Promise<PaginatedAuditLogs>;
}

export const AUDIT_LOG_REPOSITORY = Symbol('IAuditLogRepository');
