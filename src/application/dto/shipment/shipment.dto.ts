import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsInt,
    IsArray,
    Min,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// ==================== CREATE SHIPMENT ====================

export class CreateShipmentItemDto {
    @ApiProperty({ description: 'ID товара', example: 'uuid' })
    @IsString({ message: 'ID товара должен быть строкой' })
    @IsNotEmpty({ message: 'ID товара обязателен' })
    productId: string;

    @ApiProperty({ description: 'Количество коробок для отправки', example: 5 })
    @IsInt({ message: 'Количество коробок должно быть целым числом' })
    @Min(0, { message: 'Количество коробок не может быть отрицательным' })
    @Type(() => Number)
    boxCount: number;

    @ApiProperty({ description: 'Количество пар для отправки', example: 40 })
    @IsInt({ message: 'Количество пар должно быть целым числом' })
    @Min(0, { message: 'Количество пар не может быть отрицательным' })
    @Type(() => Number)
    pairCount: number;
}

export class CreateShipmentDto {
    @ApiProperty({ description: 'ID точки отправителя', example: 'uuid' })
    @IsString({ message: 'ID точки отправителя должен быть строкой' })
    @IsNotEmpty({ message: 'ID точки отправителя обязателен' })
    fromPointId: string;

    @ApiProperty({ description: 'ID точки получателя', example: 'uuid' })
    @IsString({ message: 'ID точки получателя должен быть строкой' })
    @IsNotEmpty({ message: 'ID точки получателя обязателен' })
    toPointId: string;

    @ApiPropertyOptional({ description: 'Фото накладной', example: 'photo.jpg' })
    @IsString({ message: 'Фото накладной должно быть строкой' })
    @IsOptional()
    waybillPhoto?: string;

    @ApiPropertyOptional({ description: 'Фото транспорта', example: 'transport.jpg' })
    @IsString({ message: 'Фото транспорта должно быть строкой' })
    @IsOptional()
    transportPhoto?: string;

    @ApiPropertyOptional({ description: 'Примечание' })
    @IsString({ message: 'Примечание должно быть строкой' })
    @IsOptional()
    note?: string;

    @ApiProperty({ description: 'Товары для отправки', type: [CreateShipmentItemDto] })
    @IsArray({ message: 'items должен быть массивом' })
    @ArrayMinSize(1, { message: 'Минимум 1 товар для отправки' })
    @ValidateNested({ each: true })
    @Type(() => CreateShipmentItemDto)
    items: CreateShipmentItemDto[];
}

// ==================== ACCEPT SHIPMENT ====================

export class AcceptShipmentDto {
    @ApiPropertyOptional({ description: 'Фото подписанной накладной', example: 'signed.jpg' })
    @IsString({ message: 'Фото накладной должно быть строкой' })
    @IsOptional()
    receiverWaybillPhoto?: string;
}

// ==================== QUERY ====================

export class ShipmentSearchQueryDto {
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

    @ApiPropertyOptional({ description: 'Фильтр по статусу', example: 'SENT' })
    @IsString()
    @IsOptional()
    status?: string;
}

// ==================== RESPONSE ====================

export class ShipmentItemResponseDto {
    @ApiProperty({ description: 'ID элемента' })
    id: string;

    @ApiProperty({ description: 'ID товара' })
    productId: string;

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
}

export class ShipmentResponseDto {
    @ApiProperty({ description: 'ID отправки' })
    id: string;

    @ApiProperty({ description: 'Номер отправки' })
    number: string;

    @ApiProperty({ description: 'ID аккаунта отправителя' })
    fromAccountId: string;

    @ApiProperty({ description: 'ID аккаунта получателя' })
    toAccountId: string;

    @ApiProperty({ description: 'ID точки отправителя' })
    fromPointId: string;

    @ApiProperty({ description: 'ID точки получателя' })
    toPointId: string;

    @ApiPropertyOptional({ description: 'ID склада отправителя' })
    fromWarehouseId: string | null;

    @ApiPropertyOptional({ description: 'ID склада получателя' })
    toWarehouseId: string | null;

    @ApiProperty({ description: 'Сумма в юанях' })
    totalYuan: number;

    @ApiProperty({ description: 'Сумма в рублях' })
    totalRub: number;

    @ApiPropertyOptional({ description: 'Фото накладной' })
    waybillPhoto: string | null;

    @ApiPropertyOptional({ description: 'Фото транспорта' })
    transportPhoto: string | null;

    @ApiPropertyOptional({ description: 'Фото подписанной накладной' })
    receiverWaybillPhoto: string | null;

    @ApiProperty({ description: 'Статус' })
    status: string;

    @ApiPropertyOptional({ description: 'Примечание' })
    note: string | null;

    @ApiPropertyOptional({ description: 'Дата отправки' })
    sentAt: Date | null;

    @ApiPropertyOptional({ description: 'Дата получения' })
    receivedAt: Date | null;

    @ApiPropertyOptional({ description: 'Дата подтверждения' })
    confirmedAt: Date | null;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;

    @ApiProperty({ description: 'Товары', type: [ShipmentItemResponseDto] })
    items: ShipmentItemResponseDto[];

    @ApiPropertyOptional({ description: 'Название аккаунта отправителя' })
    fromAccountName?: string;

    @ApiPropertyOptional({ description: 'Название аккаунта получателя' })
    toAccountName?: string;

    @ApiPropertyOptional({ description: 'Название точки отправителя' })
    fromPointName?: string;

    @ApiPropertyOptional({ description: 'Название точки получателя' })
    toPointName?: string;

    @ApiPropertyOptional({ description: 'Название склада отправителя' })
    fromWarehouseName?: string;

    @ApiPropertyOptional({ description: 'Название склада получателя' })
    toWarehouseName?: string;
}

export class PaginatedShipmentsResponseDto {
    @ApiProperty({ description: 'Список отправок', type: [ShipmentResponseDto] })
    items: ShipmentResponseDto[];

    @ApiProperty({ description: 'Общее количество', example: 100 })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Количество на странице', example: 20 })
    limit: number;

    @ApiProperty({ description: 'Всего страниц', example: 5 })
    totalPages: number;
}
