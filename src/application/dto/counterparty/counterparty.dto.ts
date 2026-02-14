import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsInt,
    IsEnum,
    IsBoolean,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// ==================== CREATE COUNTERPARTY ====================

export class CreateCounterpartyDto {
    @ApiProperty({ description: 'Имя контрагента', example: 'Иванов Иван' })
    @IsString({ message: 'Имя должно быть строкой' })
    @IsNotEmpty({ message: 'Имя обязательно' })
    name: string;

    @ApiPropertyOptional({ description: 'Телефон', example: '+79001234567' })
    @IsString({ message: 'Телефон должен быть строкой' })
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ description: 'Примечание' })
    @IsString({ message: 'Примечание должно быть строкой' })
    @IsOptional()
    note?: string;

    @ApiProperty({ description: 'Тип: SUPPLIER или CLIENT', example: 'SUPPLIER' })
    @IsEnum(['SUPPLIER', 'CLIENT'], { message: 'Тип должен быть SUPPLIER или CLIENT' })
    @IsNotEmpty({ message: 'Тип обязателен' })
    type: string;
}

// ==================== UPDATE COUNTERPARTY ====================

export class UpdateCounterpartyDto {
    @ApiPropertyOptional({ description: 'Имя контрагента' })
    @IsString({ message: 'Имя должно быть строкой' })
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Телефон' })
    @IsString({ message: 'Телефон должен быть строкой' })
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ description: 'Примечание' })
    @IsString({ message: 'Примечание должно быть строкой' })
    @IsOptional()
    note?: string;

    @ApiPropertyOptional({ description: 'Активен ли' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

// ==================== PAY DEBT ====================

export class PayCounterpartyDebtDto {
    @ApiProperty({ description: 'ID контрагента', example: 'uuid' })
    @IsString({ message: 'ID контрагента должен быть строкой' })
    @IsNotEmpty({ message: 'ID контрагента обязателен' })
    counterpartyId: string;

    @ApiProperty({ description: 'Сумма оплаты', example: 5000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0.01, { message: 'Сумма должна быть больше 0' })
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({ description: 'ID магазина (для оплаты из кассы)', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsOptional()
    shopId?: string;

    @ApiPropertyOptional({ description: 'Описание' })
    @IsString({ message: 'Описание должно быть строкой' })
    @IsOptional()
    description?: string;
}

// ==================== QUERY ====================

export class CounterpartySearchQueryDto {
    @ApiPropertyOptional({ description: 'Номер страницы', example: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ description: 'Количество на странице', example: 20 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({ description: 'Тип контрагента', example: 'SUPPLIER' })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiPropertyOptional({ description: 'Поиск по имени или телефону' })
    @IsString()
    @IsOptional()
    search?: string;
}

export class TransactionSearchQueryDto {
    @ApiPropertyOptional({ description: 'Номер страницы', example: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ description: 'Количество на странице', example: 20 })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

// ==================== RESPONSE ====================

export class CounterpartyTransactionResponseDto {
    @ApiProperty({ description: 'ID транзакции' })
    id: string;

    @ApiProperty({ description: 'ID контрагента' })
    counterpartyId: string;

    @ApiProperty({ description: 'Тип транзакции' })
    type: string;

    @ApiProperty({ description: 'Сумма' })
    amount: number;

    @ApiPropertyOptional({ description: 'Описание' })
    description: string | null;

    @ApiPropertyOptional({ description: 'ID связанной записи' })
    relatedId: string | null;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
}

export class CounterpartyResponseDto {
    @ApiProperty({ description: 'ID контрагента' })
    id: string;

    @ApiProperty({ description: 'Имя' })
    name: string;

    @ApiPropertyOptional({ description: 'Телефон' })
    phone: string | null;

    @ApiPropertyOptional({ description: 'Примечание' })
    note: string | null;

    @ApiProperty({ description: 'Тип' })
    type: string;

    @ApiProperty({ description: 'ID аккаунта' })
    accountId: string;

    @ApiProperty({ description: 'Баланс (для SUPPLIER: + мы должны; для CLIENT: + нам должны)' })
    balance: number;

    @ApiProperty({ description: 'Активен ли' })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
}

export class PaginatedCounterpartiesResponseDto {
    @ApiProperty({ description: 'Список контрагентов', type: [CounterpartyResponseDto] })
    items: CounterpartyResponseDto[];

    @ApiProperty({ description: 'Общее количество', example: 100 })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Количество на странице', example: 20 })
    limit: number;

    @ApiProperty({ description: 'Всего страниц', example: 5 })
    totalPages: number;
}

export class PaginatedCounterpartyTransactionsResponseDto {
    @ApiProperty({ description: 'Список транзакций', type: [CounterpartyTransactionResponseDto] })
    items: CounterpartyTransactionResponseDto[];

    @ApiProperty({ description: 'Общее количество', example: 100 })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Количество на странице', example: 20 })
    limit: number;

    @ApiProperty({ description: 'Всего страниц', example: 5 })
    totalPages: number;
}
