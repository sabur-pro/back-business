import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsInt,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// ==================== PAY FROM CASH REGISTER ====================

export class PayFromCashRegisterDto {
    @ApiProperty({ description: 'ID магазина', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiProperty({ description: 'ID контрагента (поставщик)', example: 'uuid' })
    @IsString({ message: 'ID контрагента должен быть строкой' })
    @IsNotEmpty({ message: 'ID контрагента обязателен' })
    counterpartyId: string;

    @ApiProperty({ description: 'Сумма оплаты', example: 5000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0.01, { message: 'Сумма должна быть больше 0' })
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({ description: 'Описание' })
    @IsString({ message: 'Описание должно быть строкой' })
    @IsOptional()
    description?: string;
}

export class ReceiveToCashRegisterDto {
    @ApiProperty({ description: 'ID магазина', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiProperty({ description: 'ID контрагента (клиент)', example: 'uuid' })
    @IsString({ message: 'ID контрагента должен быть строкой' })
    @IsNotEmpty({ message: 'ID контрагента обязателен' })
    counterpartyId: string;

    @ApiProperty({ description: 'Сумма получения', example: 5000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0.01, { message: 'Сумма должна быть больше 0' })
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({ description: 'Описание' })
    @IsString({ message: 'Описание должно быть строкой' })
    @IsOptional()
    description?: string;
}

// ==================== QUERY ====================

export class CashTransactionSearchQueryDto {
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

export class CashTransactionResponseDto {
    @ApiProperty({ description: 'ID транзакции' })
    id: string;

    @ApiProperty({ description: 'ID кассы' })
    cashRegisterId: string;

    @ApiProperty({ description: 'Тип транзакции' })
    type: string;

    @ApiProperty({ description: 'Сумма' })
    amount: number;

    @ApiPropertyOptional({ description: 'Описание' })
    description: string | null;

    @ApiPropertyOptional({ description: 'ID контрагента' })
    counterpartyId: string | null;

    @ApiPropertyOptional({ description: 'ID связанной записи' })
    relatedId: string | null;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
}

export class CashRegisterResponseDto {
    @ApiProperty({ description: 'ID кассы' })
    id: string;

    @ApiProperty({ description: 'ID магазина' })
    shopId: string;

    @ApiProperty({ description: 'Баланс кассы (наличные)' })
    balance: number;

    @ApiProperty({ description: 'Баланс на карте' })
    cardBalance: number;

    @ApiProperty({ description: 'Баланс в сейфе' })
    safeBalance: number;

    @ApiPropertyOptional({ description: 'Название магазина' })
    shopName?: string;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
}

export class CashRegisterSummaryResponseDto {
    @ApiProperty({ description: 'Касса' })
    register: CashRegisterResponseDto;

    @ApiProperty({ description: 'Итого мы должны поставщикам' })
    totalOwedToSuppliers: number;

    @ApiProperty({ description: 'Итого нам должны клиенты' })
    totalOwedByClients: number;
}

// ==================== TRANSFER FUNDS ====================

export class TransferToSafeDto {
    @ApiProperty({ description: 'ID магазина', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiProperty({ description: 'Сумма перевода', example: 5000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0.01, { message: 'Сумма должна быть больше 0' })
    @Type(() => Number)
    amount: number;

    @ApiProperty({ description: 'Источник: CASH или CARD', enum: ['CASH', 'CARD'], example: 'CASH' })
    @IsString()
    @IsNotEmpty()
    source: string;
}

export class TransferFundsDto {
    @ApiProperty({ description: 'ID магазина', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiProperty({ description: 'Сумма перевода', example: 5000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0.01, { message: 'Сумма должна быть больше 0' })
    @Type(() => Number)
    amount: number;

    @ApiProperty({ description: 'Откуда', enum: ['CASH', 'CARD', 'SAFE'], example: 'CASH' })
    @IsString()
    @IsNotEmpty()
    from: string;

    @ApiProperty({ description: 'Куда', enum: ['CASH', 'CARD', 'SAFE'], example: 'SAFE' })
    @IsString()
    @IsNotEmpty()
    to: string;
}

// ==================== CREATE EXPENSE ====================

export class CreateExpenseDto {
    @ApiProperty({ description: 'ID магазина', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiProperty({ description: 'Категория расхода', example: 'обед' })
    @IsString({ message: 'Категория должна быть строкой' })
    @IsNotEmpty({ message: 'Категория обязательна' })
    category: string;

    @ApiProperty({ description: 'Сумма расхода', example: 500 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0.01, { message: 'Сумма должна быть больше 0' })
    @Type(() => Number)
    amount: number;

    @ApiPropertyOptional({ description: 'Описание' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Тип оплаты', enum: ['CASH', 'CARD'], example: 'CASH' })
    @IsString()
    @IsOptional()
    paymentMethod?: string;
}

export class ExpenseResponseDto {
    @ApiProperty({ description: 'ID расхода' })
    id: string;

    @ApiProperty({ description: 'ID кассы' })
    cashRegisterId: string;

    @ApiProperty({ description: 'Категория' })
    category: string;

    @ApiProperty({ description: 'Сумма' })
    amount: number;

    @ApiPropertyOptional({ description: 'Описание' })
    description: string | null;

    @ApiProperty({ description: 'Тип оплаты' })
    paymentMethod: string;

    @ApiPropertyOptional({ description: 'ID создателя' })
    createdById: string | null;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
}

export class ExpenseSearchQueryDto {
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

export class PaginatedExpensesResponseDto {
    @ApiProperty({ description: 'Список расходов', type: [ExpenseResponseDto] })
    items: ExpenseResponseDto[];

    @ApiProperty({ description: 'Общее количество' })
    total: number;

    @ApiProperty({ description: 'Текущая страница' })
    page: number;

    @ApiProperty({ description: 'Количество на странице' })
    limit: number;

    @ApiProperty({ description: 'Всего страниц' })
    totalPages: number;
}

// ==================== PAYOUT ====================

export class CreatePayoutDto {
    @ApiProperty({ description: 'ID магазина', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiPropertyOptional({ description: 'Сумма наличными', example: 3000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    cashAmount?: number;

    @ApiPropertyOptional({ description: 'Сумма из сейфа', example: 2000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    safeAmount?: number;

    @ApiPropertyOptional({ description: 'Сумма на карту', example: 1000 })
    @IsNumber({}, { message: 'Сумма должна быть числом' })
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    cardAmount?: number;

    @ApiPropertyOptional({ description: 'Примечание' })
    @IsString()
    @IsOptional()
    note?: string;
}

export class PayoutResponseDto {
    @ApiProperty({ description: 'ID выдачи' })
    id: string;

    @ApiProperty({ description: 'Номер выдачи' })
    number: string;

    @ApiProperty({ description: 'ID кассы' })
    cashRegisterId: string;

    @ApiProperty({ description: 'ID магазина' })
    shopId: string;

    @ApiProperty({ description: 'ID аккаунта' })
    accountId: string;

    @ApiProperty({ description: 'Сумма наличными' })
    cashAmount: number;

    @ApiProperty({ description: 'Сумма из сейфа' })
    safeAmount: number;

    @ApiProperty({ description: 'Сумма на карту' })
    cardAmount: number;

    @ApiProperty({ description: 'Общая сумма' })
    totalAmount: number;

    @ApiProperty({ description: 'Статус' })
    status: string;

    @ApiPropertyOptional({ description: 'Примечание' })
    note: string | null;

    @ApiPropertyOptional({ description: 'ID создателя' })
    createdById: string | null;

    @ApiPropertyOptional({ description: 'ID одобрившего' })
    approvedById: string | null;

    @ApiPropertyOptional({ description: 'Дата одобрения' })
    approvedAt: Date | null;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
}

export class PayoutSearchQueryDto {
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

    @ApiPropertyOptional({ description: 'Фильтр по статусу', example: 'PENDING' })
    @IsString()
    @IsOptional()
    status?: string;
}

export class PaginatedPayoutsResponseDto {
    @ApiProperty({ description: 'Список выдач', type: [PayoutResponseDto] })
    items: PayoutResponseDto[];

    @ApiProperty({ description: 'Общее количество' })
    total: number;

    @ApiProperty({ description: 'Текущая страница' })
    page: number;

    @ApiProperty({ description: 'Количество на странице' })
    limit: number;

    @ApiProperty({ description: 'Всего страниц' })
    totalPages: number;
}

export class PaginatedCashTransactionsResponseDto {
    @ApiProperty({ description: 'Список транзакций', type: [CashTransactionResponseDto] })
    items: CashTransactionResponseDto[];

    @ApiProperty({ description: 'Общее количество', example: 100 })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Количество на странице', example: 20 })
    limit: number;

    @ApiProperty({ description: 'Всего страниц', example: 5 })
    totalPages: number;
}
