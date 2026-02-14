import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsInt,
    Min,
    MaxLength,
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ description: 'Артикул', example: 'A393-1' })
    @IsString({ message: 'Артикул должен быть строкой' })
    @IsNotEmpty({ message: 'Артикул обязателен' })
    @MaxLength(100, { message: 'Артикул не более 100 символов' })
    sku: string;

    @ApiPropertyOptional({ description: 'Фото оригинал (физический)', example: 'https://...' })
    @IsString({ message: 'Фото оригинал должно быть строкой' })
    @IsOptional()
    photoOriginal?: string;

    @ApiPropertyOptional({ description: 'Фото товара', example: 'https://...' })
    @IsString({ message: 'Фото должно быть строкой' })
    @IsOptional()
    photo?: string;

    @ApiPropertyOptional({ description: 'Код соответствия / размерный ряд', example: '41-45/12221' })
    @IsString({ message: 'Размерный ряд должен быть строкой' })
    @IsOptional()
    @MaxLength(100, { message: 'Размерный ряд не более 100 символов' })
    sizeRange?: string;

    @ApiProperty({ description: 'Количество коробок', example: 10 })
    @IsInt({ message: 'Количество коробок должно быть целым числом' })
    @Min(0, { message: 'Количество коробок не может быть отрицательным' })
    @Type(() => Number)
    boxCount: number;

    @ApiProperty({ description: 'Количество пар', example: 80 })
    @IsInt({ message: 'Количество пар должно быть целым числом' })
    @Min(0, { message: 'Количество пар не может быть отрицательным' })
    @Type(() => Number)
    pairCount: number;

    @ApiProperty({ description: 'Цена в юанях', example: 175 })
    @IsNumber({}, { message: 'Цена в юанях должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @Type(() => Number)
    priceYuan: number;

    @ApiProperty({ description: 'Цена в рублях', example: 2500 })
    @IsNumber({}, { message: 'Цена в рублях должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @Type(() => Number)
    priceRub: number;

    @ApiProperty({ description: 'Общая сумма в юанях', example: 14000 })
    @IsNumber({}, { message: 'Сумма в юанях должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @Type(() => Number)
    totalYuan: number;

    @ApiProperty({ description: 'Общая сумма в рублях', example: 200000 })
    @IsNumber({}, { message: 'Сумма в рублях должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @Type(() => Number)
    totalRub: number;

    @ApiPropertyOptional({ description: 'Рекомендованная сумма продажи за коробку', example: 3000 })
    @IsNumber({}, { message: 'Рекомендованная сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    recommendedSalePrice?: number;

    @ApiPropertyOptional({ description: 'Итого рекомендованная сумма продажи', example: 30000 })
    @IsNumber({}, { message: 'Итого рекомендованная сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalRecommendedSale?: number;

    @ApiPropertyOptional({ description: 'Фактическая сумма продажи за пару', example: 0 })
    @IsNumber({}, { message: 'Фактическая сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    actualSalePrice?: number;

    @ApiPropertyOptional({ description: 'Итого фактическая сумма продажи', example: 0 })
    @IsNumber({}, { message: 'Итого фактическая сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalActualSale?: number;

    @ApiPropertyOptional({ description: 'Баркод / QR-код данные', example: '4601234567890' })
    @IsString({ message: 'Баркод должен быть строкой' })
    @IsOptional()
    @MaxLength(255, { message: 'Баркод не более 255 символов' })
    barcode?: string;

    @ApiProperty({ description: 'ID точки', example: 'uuid' })
    @IsString({ message: 'ID точки должен быть строкой' })
    @IsNotEmpty({ message: 'ID точки обязателен' })
    pointId: string;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ description: 'Артикул', example: 'A393-1' })
    @IsString({ message: 'Артикул должен быть строкой' })
    @IsOptional()
    @MaxLength(100, { message: 'Артикул не более 100 символов' })
    sku?: string;

    @ApiPropertyOptional({ description: 'Фото оригинал (физический)', example: 'https://...' })
    @IsString({ message: 'Фото оригинал должно быть строкой' })
    @IsOptional()
    photoOriginal?: string;

    @ApiPropertyOptional({ description: 'Фото товара', example: 'https://...' })
    @IsString({ message: 'Фото должно быть строкой' })
    @IsOptional()
    photo?: string;

    @ApiPropertyOptional({ description: 'Код соответствия / размерный ряд', example: '41-45/12221' })
    @IsString({ message: 'Размерный ряд должен быть строкой' })
    @IsOptional()
    @MaxLength(100, { message: 'Размерный ряд не более 100 символов' })
    sizeRange?: string;

    @ApiPropertyOptional({ description: 'Количество коробок', example: 10 })
    @IsInt({ message: 'Количество коробок должно быть целым числом' })
    @Min(0, { message: 'Количество коробок не может быть отрицательным' })
    @IsOptional()
    @Type(() => Number)
    boxCount?: number;

    @ApiPropertyOptional({ description: 'Количество пар', example: 80 })
    @IsInt({ message: 'Количество пар должно быть целым числом' })
    @Min(0, { message: 'Количество пар не может быть отрицательным' })
    @IsOptional()
    @Type(() => Number)
    pairCount?: number;

    @ApiPropertyOptional({ description: 'Цена в юанях', example: 175 })
    @IsNumber({}, { message: 'Цена в юанях должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    priceYuan?: number;

    @ApiPropertyOptional({ description: 'Цена в рублях', example: 2500 })
    @IsNumber({}, { message: 'Цена в рублях должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    priceRub?: number;

    @ApiPropertyOptional({ description: 'Общая сумма в юанях', example: 14000 })
    @IsNumber({}, { message: 'Сумма в юанях должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalYuan?: number;

    @ApiPropertyOptional({ description: 'Общая сумма в рублях', example: 200000 })
    @IsNumber({}, { message: 'Сумма в рублях должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalRub?: number;

    @ApiPropertyOptional({ description: 'Рекомендованная сумма продажи за коробку', example: 3000 })
    @IsNumber({}, { message: 'Рекомендованная сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    recommendedSalePrice?: number;

    @ApiPropertyOptional({ description: 'Итого рекомендованная сумма продажи', example: 30000 })
    @IsNumber({}, { message: 'Итого рекомендованная сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalRecommendedSale?: number;

    @ApiPropertyOptional({ description: 'Фактическая сумма продажи за пару', example: 0 })
    @IsNumber({}, { message: 'Фактическая сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    actualSalePrice?: number;

    @ApiPropertyOptional({ description: 'Итого фактическая сумма продажи', example: 0 })
    @IsNumber({}, { message: 'Итого фактическая сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalActualSale?: number;

    @ApiPropertyOptional({ description: 'Баркод / QR-код данные', example: '4601234567890' })
    @IsString({ message: 'Баркод должен быть строкой' })
    @IsOptional()
    @MaxLength(255, { message: 'Баркод не более 255 символов' })
    barcode?: string;

    @ApiPropertyOptional({ description: 'Активен ли товар', example: true })
    @IsBoolean({ message: 'isActive должен быть булевым' })
    @IsOptional()
    isActive?: boolean;
}

export class BatchProductItemDto {
    @ApiProperty({ description: 'Артикул', example: 'A393-1' })
    @IsString({ message: 'Артикул должен быть строкой' })
    @IsNotEmpty({ message: 'Артикул обязателен' })
    @MaxLength(100, { message: 'Артикул не более 100 символов' })
    sku: string;

    @ApiPropertyOptional({ description: 'Фото оригинал (физический)', example: 'https://...' })
    @IsString({ message: 'Фото оригинал должно быть строкой' })
    @IsOptional()
    photoOriginal?: string;

    @ApiPropertyOptional({ description: 'Фото товара', example: 'https://...' })
    @IsString({ message: 'Фото должно быть строкой' })
    @IsOptional()
    photo?: string;

    @ApiPropertyOptional({ description: 'Код соответствия / размерный ряд', example: '41-45/12221' })
    @IsString({ message: 'Размерный ряд должен быть строкой' })
    @IsOptional()
    @MaxLength(100, { message: 'Размерный ряд не более 100 символов' })
    sizeRange?: string;

    @ApiProperty({ description: 'Количество коробок', example: 10 })
    @IsInt({ message: 'Количество коробок должно быть целым числом' })
    @Min(0, { message: 'Количество коробок не может быть отрицательным' })
    @Type(() => Number)
    boxCount: number;

    @ApiProperty({ description: 'Количество пар', example: 80 })
    @IsInt({ message: 'Количество пар должно быть целым числом' })
    @Min(0, { message: 'Количество пар не может быть отрицательным' })
    @Type(() => Number)
    pairCount: number;

    @ApiProperty({ description: 'Цена в юанях', example: 175 })
    @IsNumber({}, { message: 'Цена в юанях должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @Type(() => Number)
    priceYuan: number;

    @ApiProperty({ description: 'Цена в рублях', example: 2500 })
    @IsNumber({}, { message: 'Цена в рублях должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @Type(() => Number)
    priceRub: number;

    @ApiProperty({ description: 'Общая сумма в юанях', example: 14000 })
    @IsNumber({}, { message: 'Сумма в юанях должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @Type(() => Number)
    totalYuan: number;

    @ApiProperty({ description: 'Общая сумма в рублях', example: 200000 })
    @IsNumber({}, { message: 'Сумма в рублях должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @Type(() => Number)
    totalRub: number;

    @ApiPropertyOptional({ description: 'Рекомендованная сумма продажи за коробку', example: 3000 })
    @IsNumber({}, { message: 'Рекомендованная сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    recommendedSalePrice?: number;

    @ApiPropertyOptional({ description: 'Итого рекомендованная сумма продажи', example: 30000 })
    @IsNumber({}, { message: 'Итого рекомендованная сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalRecommendedSale?: number;

    @ApiPropertyOptional({ description: 'Фактическая сумма продажи за пару', example: 0 })
    @IsNumber({}, { message: 'Фактическая сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    actualSalePrice?: number;

    @ApiPropertyOptional({ description: 'Итого фактическая сумма продажи', example: 0 })
    @IsNumber({}, { message: 'Итого фактическая сумма должна быть числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    totalActualSale?: number;

    @ApiPropertyOptional({ description: 'Баркод / QR-код данные', example: '4601234567890' })
    @IsString({ message: 'Баркод должен быть строкой' })
    @IsOptional()
    @MaxLength(255, { message: 'Баркод не более 255 символов' })
    barcode?: string;
}

export class BatchCreateProductsDto {
    @ApiProperty({ description: 'ID точки', example: 'uuid' })
    @IsString({ message: 'ID точки должен быть строкой' })
    @IsNotEmpty({ message: 'ID точки обязателен' })
    pointId: string;

    @ApiPropertyOptional({ description: 'ID склада', example: 'uuid' })
    @IsString({ message: 'ID склада должен быть строкой' })
    @IsOptional()
    warehouseId?: string;

    @ApiPropertyOptional({ description: 'ID поставщика (контрагент)', example: 'uuid' })
    @IsString({ message: 'ID поставщика должен быть строкой' })
    @IsOptional()
    supplierId?: string;

    @ApiPropertyOptional({ description: 'Сумма оплаты поставщику', example: 4000 })
    @IsNumber({}, { message: 'Сумма оплаты должна быть числом' })
    @Min(0, { message: 'Сумма оплаты не может быть отрицательной' })
    @IsOptional()
    @Type(() => Number)
    paidAmount?: number;

    @ApiProperty({ description: 'Список товаров для добавления', type: [BatchProductItemDto] })
    @IsArray({ message: 'items должен быть массивом' })
    @ArrayMinSize(1, { message: 'Минимум 1 товар' })
    @ValidateNested({ each: true })
    @Type(() => BatchProductItemDto)
    items: BatchProductItemDto[];
}

export class ProductResponseDto {
    @ApiProperty({ description: 'ID товара' })
    id: string;

    @ApiProperty({ description: 'Артикул' })
    sku: string;

    @ApiPropertyOptional({ description: 'Фото оригинал (физический)' })
    photoOriginal: string | null;

    @ApiPropertyOptional({ description: 'Фото товара' })
    photo: string | null;

    @ApiPropertyOptional({ description: 'Код соответствия / размерный ряд' })
    sizeRange: string | null;

    @ApiProperty({ description: 'Количество коробок' })
    boxCount: number;

    @ApiProperty({ description: 'Количество пар' })
    pairCount: number;

    @ApiProperty({ description: 'Цена в юанях' })
    priceYuan: number;

    @ApiProperty({ description: 'Цена в рублях' })
    priceRub: number;

    @ApiProperty({ description: 'Общая сумма в юанях' })
    totalYuan: number;

    @ApiProperty({ description: 'Общая сумма в рублях' })
    totalRub: number;

    @ApiProperty({ description: 'Рекомендованная сумма продажи за коробку' })
    recommendedSalePrice: number;

    @ApiProperty({ description: 'Итого рекомендованная сумма продажи' })
    totalRecommendedSale: number;

    @ApiProperty({ description: 'Фактическая сумма продажи за коробку' })
    actualSalePrice: number;

    @ApiProperty({ description: 'Итого фактическая сумма продажи' })
    totalActualSale: number;

    @ApiPropertyOptional({ description: 'Баркод / QR-код данные' })
    barcode: string | null;

    @ApiProperty({ description: 'ID организации' })
    accountId: string;

    @ApiPropertyOptional({ description: 'ID склада' })
    warehouseId: string | null;

    @ApiProperty({ description: 'Активен ли товар' })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
}

export class BatchCreateProductsResponseDto {
    @ApiProperty({ description: 'Созданные товары', type: [ProductResponseDto] })
    products: ProductResponseDto[];

    @ApiProperty({ description: 'Количество созданных товаров', example: 3 })
    count: number;
}

export class ProductSearchQueryDto {
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

    @ApiPropertyOptional({ description: 'Поисковый запрос (артикул, размерный ряд, баркод)', example: 'A393' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Фильтр: только товары с 0 коробок', example: true })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    zeroBoxes?: boolean;
}

export class PaginatedProductsResponseDto {
    @ApiProperty({ description: 'Список товаров', type: [ProductResponseDto] })
    items: ProductResponseDto[];

    @ApiProperty({ description: 'Общее количество', example: 100 })
    total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    page: number;

    @ApiProperty({ description: 'Количество на странице', example: 20 })
    limit: number;

    @ApiProperty({ description: 'Всего страниц', example: 5 })
    totalPages: number;
}
