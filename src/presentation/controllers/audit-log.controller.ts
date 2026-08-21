import {
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators';
import {
    AuditLogQueryDto,
    AuditLogResponseDto,
    PaginatedAuditLogsResponseDto,
} from '@application/dto/audit';
import { GetAuditLogsUseCase } from '@application/use-cases/audit';

@ApiTags('История изменений')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditLogController {
    constructor(
        private readonly getAuditLogsUseCase: GetAuditLogsUseCase,
    ) { }

    @Get('entity/:entityType/:entityId')
    @ApiOperation({ summary: 'История конкретной сущности (товар, отправка)' })
    @ApiResponse({ status: 200, description: 'Список записей', type: [AuditLogResponseDto] })
    async getByEntity(
        @CurrentUser('id') userId: string,
        @Param('entityType') entityType: string,
        @Param('entityId') entityId: string,
    ): Promise<AuditLogResponseDto[]> {
        const logs = await this.getAuditLogsUseCase.getByEntity(userId, entityType, entityId);
        return logs.map((log) => ({
            id: log.id,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            userId: log.userId,
            userName: log.userName,
            accountId: log.accountId,
            oldData: log.oldData,
            newData: log.newData,
            metadata: log.metadata,
            createdAt: log.createdAt,
        }));
    }

    @Get('account/:accountId')
    @ApiOperation({ summary: 'Вся история организации с фильтрами' })
    @ApiResponse({ status: 200, description: 'Список записей с пагинацией', type: PaginatedAuditLogsResponseDto })
    async getByAccount(
        @CurrentUser('id') userId: string,
        @Param('accountId') accountId: string,
        @Query() query: AuditLogQueryDto,
    ): Promise<PaginatedAuditLogsResponseDto> {
        const result = await this.getAuditLogsUseCase.getByAccount(userId, accountId, {
            page: query.page,
            limit: query.limit,
            action: query.action,
            entityType: query.entityType,
        });

        return {
            items: result.items.map((log) => ({
                id: log.id,
                action: log.action,
                entityType: log.entityType,
                entityId: log.entityId,
                userId: log.userId,
                userName: log.userName,
                accountId: log.accountId,
                oldData: log.oldData,
                newData: log.newData,
                metadata: log.metadata,
                createdAt: log.createdAt,
            })),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
}
