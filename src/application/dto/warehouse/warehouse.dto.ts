import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateWarehouseDto {
    @ApiProperty({ description: 'Название склада', example: 'Основной склад' })
    @IsString({ message: 'Название должно быть строкой' })
    @IsNotEmpty({ message: 'Название обязательно' })
    @MaxLength(100, { message: 'Название не более 100 символов' })
    name: string;

    @ApiProperty({ description: 'ID точки', example: 'uuid' })
    @IsString({ message: 'ID точки должен быть строкой' })
    @IsNotEmpty({ message: 'ID точки обязателен' })
    pointId: string;

    @ApiPropertyOptional({ description: 'Адрес склада', example: 'ул. Складская, 1' })
    @IsString({ message: 'Адрес должен быть строкой' })
    @IsOptional()
    @MaxLength(255, { message: 'Адрес не более 255 символов' })
    address?: string;

    @ApiPropertyOptional({ description: 'Описание склада', example: 'Главный склад для хранения товаров' })
    @IsString({ message: 'Описание должно быть строкой' })
    @IsOptional()
    @MaxLength(500, { message: 'Описание не более 500 символов' })
    description?: string;
}

export class UpdateWarehouseDto {
    @ApiPropertyOptional({ description: 'Название склада', example: 'Основной склад' })
    @IsString({ message: 'Название должно быть строкой' })
    @IsOptional()
    @MaxLength(100, { message: 'Название не более 100 символов' })
    name?: string;

    @ApiPropertyOptional({ description: 'Адрес склада', example: 'ул. Складская, 1' })
    @IsString({ message: 'Адрес должен быть строкой' })
    @IsOptional()
    @MaxLength(255, { message: 'Адрес не более 255 символов' })
    address?: string;

    @ApiPropertyOptional({ description: 'Описание склада' })
    @IsString({ message: 'Описание должно быть строкой' })
    @IsOptional()
    @MaxLength(500, { message: 'Описание не более 500 символов' })
    description?: string;

    @ApiPropertyOptional({ description: 'Активен ли склад', example: true })
    @IsBoolean({ message: 'isActive должен быть булевым' })
    @IsOptional()
    isActive?: boolean;
}

export class WarehouseResponseDto {
    @ApiProperty({ description: 'ID склада' })
    id: string;

    @ApiProperty({ description: 'Название склада' })
    name: string;

    @ApiProperty({ description: 'ID точки' })
    pointId: string;

    @ApiPropertyOptional({ description: 'Адрес склада' })
    address: string | null;

    @ApiPropertyOptional({ description: 'Описание' })
    description: string | null;

    @ApiProperty({ description: 'Активен ли склад' })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
}
