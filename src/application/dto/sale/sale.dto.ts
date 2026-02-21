import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsInt,
    IsArray,
    IsEnum,
    Min,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// ==================== CREATE SALE ====================

export class CreateSaleItemDto {
    @ApiProperty({ description: 'ID товара', example: 'uuid' })
    @IsString({ message: 'ID товара должен быть строкой' })
    @IsNotEmpty({ message: 'ID товара обязателен' })
    productId: string;

    @ApiProperty({ description: 'Количество коробок для продажи', example: 2 })
    @IsInt({ message: 'Количество коробок должно быть целым числом' })
    @Min(0, { message: 'Количество коробок не может быть отрицательным' })
    @Type(() => Number)
    boxCount: number;

    @ApiProperty({ description: 'Количество пар для продажи', example: 20 })
    @IsInt({ message: 'Количество пар должно быть целым числом' })
    @Min(0, { message: 'Количество пар не может быть отрицательным' })
    @Type(() => Number)
    pairCount: number;

    @ApiProperty({ description: 'Фактическая цена продажи за пару', example: 1500 })
    @IsNumber({}, { message: 'Фактическая цена должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @Type(() => Number)
    actualSalePrice: number;
}

export class CreateSaleDto {
    @ApiProperty({ description: 'ID магазина (warehouse с типом SHOP)', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiPropertyOptional({ description: 'ID клиента (контрагент)', example: 'uuid' })
    @IsString({ message: 'ID клиента должен быть строкой' })
    @IsOptional()
    clientId?: string;

    @ApiPropertyOptional({ description: 'Сумма оплаты клиентом', example: 5000 })
    @IsNumber({}, { message: 'Сумма оплаты должна быть числом' })
    @Min(0, { message: 'Сумма оплаты не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    paidAmount?: number;

    @ApiPropertyOptional({ description: 'Тип оплаты', enum: ['CASH', 'CARD'], example: 'CASH' })
    @IsEnum(['CASH', 'CARD'], { message: 'Тип оплаты должен быть CASH или CARD' })
    @IsOptional()
    paymentMethod?: string;

    @ApiPropertyOptional({ description: 'Сумма оплаты наличными', example: 3000 })
    @IsNumber({}, { message: 'Сумма наличными должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    cashAmount?: number;

    @ApiPropertyOptional({ description: 'Сумма оплаты картой', example: 2000 })
    @IsNumber({}, { message: 'Сумма картой должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    cardAmount?: number;

    @ApiPropertyOptional({ description: 'Примечание' })
    @IsString({ message: 'Примечание должно быть строкой' })
    @IsOptional()
    note?: string;

    @ApiProperty({ description: 'Товары для продажи', type: [CreateSaleItemDto] })
    @IsArray({ message: 'items должен быть массивом' })
    @ArrayMinSize(1, { message: 'Минимум 1 товар для продажи' })
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemDto)
    items: CreateSaleItemDto[];
}

// ==================== QUERY ====================

export class SaleSearchQueryDto {
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

    @ApiPropertyOptional({ description: 'Фильтр по статусу', example: 'COMPLETED' })
    @IsString()
    @IsOptional()
    status?: string;
}

// ==================== RESPONSE ====================

export class SaleItemResponseDto {
    @ApiProperty({ description: 'ID элемента' })
    id: string;

    @ApiProperty({ description: 'ID товара' })
    productId: string | null;

    @ApiProperty({ description: 'Артикул' })
    sku: string;

    @ApiPropertyOptional({ description: 'Фото товара' })
    photo: string | null;

    @ApiPropertyOptional({ description: 'Размерный ряд' })
    sizeRange: string | null;

    @ApiProperty({ description: 'Количество коробок' })
    boxCount: number;

    @ApiProperty({ description: 'Количество пар' })
    pairCount: number;

    @ApiProperty({ description: 'Цена в юанях' })
    priceYuan: number;

    @ApiProperty({ description: 'Цена в рублях' })
    priceRub: number;

    @ApiProperty({ description: 'Сумма в юанях' })
    totalYuan: number;

    @ApiProperty({ description: 'Сумма в рублях' })
    totalRub: number;

    @ApiProperty({ description: 'Рекомендованная цена продажи за пару' })
    recommendedSalePrice: number;

    @ApiProperty({ description: 'Фактическая цена продажи за пару' })
    actualSalePrice: number;

    @ApiProperty({ description: 'Итого рекомендованная сумма' })
    totalRecommended: number;

    @ApiProperty({ description: 'Итого фактическая сумма' })
    totalActual: number;

    @ApiProperty({ description: 'Прибыль' })
    profit: number;
}

export class SaleResponseDto {
    @ApiProperty({ description: 'ID продажи' })
    id: string;

    @ApiProperty({ description: 'Номер продажи' })
    number: string;

    @ApiProperty({ description: 'ID точки' })
    pointId: string;

    @ApiProperty({ description: 'ID магазина' })
    shopId: string;

    @ApiProperty({ description: 'ID аккаунта' })
    accountId: string;

    @ApiPropertyOptional({ description: 'ID клиента' })
    clientId: string | null;

    @ApiProperty({ description: 'Сумма в юанях' })
    totalYuan: number;

    @ApiProperty({ description: 'Сумма в рублях' })
    totalRub: number;

    @ApiProperty({ description: 'Итого рекомендованная сумма' })
    totalRecommended: number;

    @ApiProperty({ description: 'Итого фактическая сумма' })
    totalActual: number;

    @ApiProperty({ description: 'Сумма оплаты клиентом' })
    paidAmount: number;

    @ApiProperty({ description: 'Тип оплаты' })
    paymentMethod: string;

    @ApiProperty({ description: 'Оплата наличными' })
    cashAmount: number;

    @ApiProperty({ description: 'Оплата картой' })
    cardAmount: number;

    @ApiProperty({ description: 'Прибыль' })
    profit: number;

    @ApiProperty({ description: 'Статус' })
    status: string;

    @ApiPropertyOptional({ description: 'Примечание' })
    note: string | null;

    @ApiPropertyOptional({ description: 'ID продавца' })
    soldById: string | null;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;

    @ApiProperty({ description: 'Товары', type: [SaleItemResponseDto] })
    items: SaleItemResponseDto[];

    @ApiPropertyOptional({ description: 'Название магазина' })
    shopName?: string;

    @ApiPropertyOptional({ description: 'Название точки' })
    pointName?: string;

    @ApiPropertyOptional({ description: 'Имя продавца' })
    soldByName?: string;

    @ApiPropertyOptional({ description: 'Имя клиента' })
    clientName?: string;
}

export class PaginatedSalesResponseDto {
    @ApiProperty({ description: 'Список продаж', type: [SaleResponseDto] })
    items: SaleResponseDto[];

    @ApiProperty({ description: 'Общее количество', example: 100 })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Количество на странице', example: 20 })
    limit: number;

    @ApiProperty({ description: 'Всего страниц', example: 5 })
    totalPages: number;
}
