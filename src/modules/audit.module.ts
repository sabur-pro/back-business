import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { AuditLogController } from '@presentation/controllers/audit-log.controller';
import {
    AuditLogRepository,
    UserRepository,
    PointRepository,
} from '@infrastructure/database/repositories';
import {
    AUDIT_LOG_REPOSITORY,
} from '@domain/repositories/audit-log.repository.interface';
import {
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { GetAuditLogsUseCase } from '@application/use-cases/audit';

@Module({
    imports: [PrismaModule],
    controllers: [AuditLogController],
    providers: [
        {
            provide: AUDIT_LOG_REPOSITORY,
            useClass: AuditLogRepository,
        },
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
        {
            provide: POINT_REPOSITORY,
            useClass: PointRepository,
        },
        GetAuditLogsUseCase,
    ],
    exports: [AUDIT_LOG_REPOSITORY],
})
export class AuditModule { }
