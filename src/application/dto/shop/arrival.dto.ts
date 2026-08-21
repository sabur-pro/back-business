import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsInt,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    Min,
    Matches,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// ==================== QUERY ====================

export class ArrivalDaysQueryDto {
    @ApiPropertyOptional({ description: 'Начало периода, YYYY-MM-DD', example: '2026-08-01' })
    @IsOptional()
    @Matches(DATE_PATTERN, { message: 'Дата должна быть в формате YYYY-MM-DD' })
    from?: string;

    @ApiPropertyOptional({ description: 'Конец периода включительно, YYYY-MM-DD', example: '2026-08-31' })
    @IsOptional()
    @Matches(DATE_PATTERN, { message: 'Дата должна быть в формате YYYY-MM-DD' })
    to?: string;

    @ApiPropertyOptional({ description: 'Смещение часового пояса клиента в минутах (МСК = 180)', example: 180 })
    @IsOptional()
    @IsInt({ message: 'Смещение часового пояса должно быть целым числом' })
    @Type(() => Number)
    tzOffset?: number;
}

export class ArrivalsQueryDto {
    @ApiProperty({ description: 'День поступления, YYYY-MM-DD', example: '2026-08-21' })
    @Matches(DATE_PATTERN, { message: 'Дата должна быть в формате YYYY-MM-DD' })
    date: string;

    @ApiPropertyOptional({ description: 'Смещение часового пояса клиента в минутах (МСК = 180)', example: 180 })
    @IsOptional()
    @IsInt({ message: 'Смещение часового пояса должно быть целым числом' })
    @Type(() => Number)
    tzOffset?: number;

    @ApiPropertyOptional({ description: 'Добавить непроданный остаток прошлых дней', example: true })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === true || value === 'true')
    includeRemainders?: boolean;
}

// ==================== RESPONSE ====================

export class ArrivalRowDto {
    @ApiProperty({ description: 'ID партии поступления' })
    id: string;

    @ApiProperty({ description: 'ID товара', nullable: true })
    productId: string | null;

    @ApiProperty({ description: 'Артикул' })
    sku: string;

    @ApiProperty({ description: 'Фото', nullable: true })
    photo: string | null;

    @ApiProperty({ description: 'Размерный ряд', nullable: true })
    sizeRange: string | null;

    @ApiProperty({ description: 'Баркод', nullable: true })
    barcode: string | null;

    @ApiProperty({ description: 'Дата поступления' })
    arrivedAt: Date;

    @ApiProperty({ description: 'Пришло коробок' })
    boxCount: number;

    @ApiProperty({ description: 'Пришло пар' })
    pairCount: number;

    @ApiProperty({ description: 'Продано коробок из партии' })
    soldBoxes: number;

    @ApiProperty({ description: 'Продано пар из партии' })
    soldPairs: number;

    @ApiProperty({ description: 'Возвращено коробок из партии' })
    returnedBoxes: number;

    @ApiProperty({ description: 'Возвращено пар из партии' })
    returnedPairs: number;

    @ApiProperty({ description: 'Доступно к продаже коробок (с учётом остатка товара)' })
    availableBoxes: number;

    @ApiProperty({ description: 'Доступно к продаже пар (с учётом остатка товара)' })
    availablePairs: number;

    @ApiProperty({ description: 'Цена закупки ¥ за пару' })
    priceYuan: number;

    @ApiProperty({ description: 'Цена закупки ₽ за пару' })
    priceRub: number;

    @ApiProperty({ description: 'Рекомендованная цена продажи за пару' })
    recommendedSalePrice: number;

    @ApiProperty({ description: 'Текущий остаток товара, коробок' })
    productBoxCount: number;

    @ApiProperty({ description: 'Текущий остаток товара, пар' })
    productPairCount: number;

    @ApiProperty({ description: 'Источник поступления', enum: ['SHIPMENT', 'RECEIPT', 'MANUAL'] })
    sourceType: string;
}

export class ArrivalTotalsDto {
    @ApiProperty({ description: 'Коробок пришло' })
    boxCount: number;

    @ApiProperty({ description: 'Пар пришло' })
    pairCount: number;

    @ApiProperty({ description: 'Коробок доступно к продаже' })
    availableBoxes: number;

    @ApiProperty({ description: 'Пар доступно к продаже' })
    availablePairs: number;

    @ApiProperty({ description: 'Себестоимость доступного остатка, ₽' })
    totalCostRub: number;

    @ApiProperty({ description: 'Рекомендованная сумма продажи доступного остатка, ₽' })
    totalRecommended: number;
}

export class ArrivalsResponseDto {
    @ApiProperty({ description: 'День поступления, YYYY-MM-DD' })
    date: string;

    @ApiProperty({ description: 'ID магазина' })
    shopId: string;

    @ApiProperty({ description: 'Партии, поступившие в этот день', type: [ArrivalRowDto] })
    items: ArrivalRowDto[];

    @ApiProperty({ description: 'Непроданный остаток прошлых дней', type: [ArrivalRowDto] })
    remainders: ArrivalRowDto[];

    @ApiProperty({ description: 'Итоги по дню', type: ArrivalTotalsDto })
    totals: ArrivalTotalsDto;
}

export class ArrivalDayDto {
    @ApiProperty({ description: 'День, YYYY-MM-DD' })
    date: string;

    @ApiProperty({ description: 'Количество партий' })
    arrivalsCount: number;

    @ApiProperty({ description: 'Пришло коробок' })
    boxCount: number;

    @ApiProperty({ description: 'Пришло пар' })
    pairCount: number;

    @ApiProperty({ description: 'Продано коробок' })
    soldBoxes: number;

    @ApiProperty({ description: 'Продано пар' })
    soldPairs: number;

    @ApiProperty({ description: 'Возвращено коробок' })
    returnedBoxes: number;

    @ApiProperty({ description: 'Возвращено пар' })
    returnedPairs: number;

    @ApiProperty({ description: 'Остаток коробок' })
    remainderBoxes: number;

    @ApiProperty({ description: 'Остаток пар' })
    remainderPairs: number;

    @ApiProperty({ description: 'Себестоимость поступления, ₽' })
    totalCostRub: number;

    @ApiProperty({ description: 'Рекомендованная сумма продажи, ₽' })
    totalRecommended: number;

    @ApiProperty({ description: 'Статус дня', enum: ['NEW', 'PARTIAL', 'DONE'] })
    status: string;
}

// ==================== RETURN ====================

export class CreateReturnItemDto {
    @ApiPropertyOptional({ description: 'ID партии поступления', example: 'uuid' })
    @IsString({ message: 'ID партии должен быть строкой' })
    @IsOptional()
    arrivalId?: string;

    @ApiProperty({ description: 'ID товара', example: 'uuid' })
    @IsString({ message: 'ID товара должен быть строкой' })
    @IsNotEmpty({ message: 'ID товара обязателен' })
    productId: string;

    @ApiProperty({ description: 'Количество коробок к возврату', example: 2 })
    @IsInt({ message: 'Количество коробок должно быть целым числом' })
    @Min(0, { message: 'Количество коробок не может быть отрицательным' })
    @Type(() => Number)
    boxCount: number;

    @ApiProperty({ description: 'Количество пар к возврату', example: 16 })
    @IsInt({ message: 'Количество пар должно быть целым числом' })
    @Min(0, { message: 'Количество пар не может быть отрицательным' })
    @Type(() => Number)
    pairCount: number;
}

export class CreateReturnDto {
    @ApiPropertyOptional({ description: 'День поступления, за который оформлен возврат, YYYY-MM-DD' })
    @IsOptional()
    @Matches(DATE_PATTERN, { message: 'Дата должна быть в формате YYYY-MM-DD' })
    arrivalDate?: string;

    @ApiPropertyOptional({ description: 'Смещение часового пояса клиента в минутах', example: 180 })
    @IsOptional()
    @IsInt({ message: 'Смещение часового пояса должно быть целым числом' })
    @Type(() => Number)
    tzOffset?: number;

    @ApiPropertyOptional({ description: 'Примечание' })
    @IsString({ message: 'Примечание должно быть строкой' })
    @IsOptional()
    note?: string;

    @ApiProperty({ description: 'Позиции возврата', type: [CreateReturnItemDto] })
    @IsArray({ message: 'items должен быть массивом' })
    @ArrayMinSize(1, { message: 'Минимум 1 позиция для возврата' })
    @ValidateNested({ each: true })
    @Type(() => CreateReturnItemDto)
    items: CreateReturnItemDto[];
}

export class ReturnItemResponseDto {
    @ApiProperty() id: string;
    @ApiProperty({ nullable: true }) arrivalId: string | null;
    @ApiProperty({ nullable: true }) productId: string | null;
    @ApiProperty() sku: string;
    @ApiProperty({ nullable: true }) photo: string | null;
    @ApiProperty({ nullable: true }) sizeRange: string | null;
    @ApiProperty() boxCount: number;
    @ApiProperty() pairCount: number;
    @ApiProperty() priceYuan: number;
    @ApiProperty() priceRub: number;
    @ApiProperty() totalYuan: number;
    @ApiProperty() totalRub: number;
}

export class ReturnResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() number: string;
    @ApiProperty() shopId: string;
    @ApiProperty() pointId: string;
    @ApiProperty() accountId: string;
    @ApiProperty({ nullable: true }) arrivalDate: Date | null;
    @ApiProperty() totalBoxes: number;
    @ApiProperty() totalPairs: number;
    @ApiProperty() totalYuan: number;
    @ApiProperty() totalRub: number;
    @ApiProperty({ nullable: true }) note: string | null;
    @ApiProperty({ nullable: true }) createdById: string | null;
    @ApiProperty() createdAt: Date;
    @ApiProperty({ type: [ReturnItemResponseDto] }) items: ReturnItemResponseDto[];
}
