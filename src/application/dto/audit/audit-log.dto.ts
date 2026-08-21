import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AuditLogQueryDto {
    @ApiPropertyOptional({ description: 'Страница', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Количество на странице', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ description: 'Фильтр по действию (AuditAction)' })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiPropertyOptional({ description: 'Фильтр по типу сущности (PRODUCT, SHIPMENT)' })
    @IsOptional()
    @IsString()
    entityType?: string;
}

export class AuditLogResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    action: string;

    @ApiProperty()
    entityType: string;

    @ApiProperty()
    entityId: string;

    @ApiProperty()
    userId: string;

    @ApiPropertyOptional()
    userName?: string;

    @ApiProperty()
    accountId: string;

    @ApiPropertyOptional()
    oldData?: any;

    @ApiPropertyOptional()
    newData?: any;

    @ApiPropertyOptional()
    metadata?: any;

    @ApiProperty()
    createdAt: Date;
}

export class PaginatedAuditLogsResponseDto {
    @ApiProperty({ type: [AuditLogResponseDto] })
    items: AuditLogResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;
}
