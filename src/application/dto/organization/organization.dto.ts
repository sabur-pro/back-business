import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty({ description: 'Название организации', example: 'Моя компания' })
    @IsString({ message: 'Название должно быть строкой' })
    @IsNotEmpty({ message: 'Название обязательно' })
    @MaxLength(100, { message: 'Название не более 100 символов' })
    name: string;
}

export class CreatePointDto {
    @ApiProperty({ description: 'Название точки', example: 'Главный офис' })
    @IsString({ message: 'Название должно быть строкой' })
    @IsNotEmpty({ message: 'Название обязательно' })
    @MaxLength(100, { message: 'Название не более 100 символов' })
    name: string;

    @ApiPropertyOptional({ description: 'Адрес точки', example: 'ул. Ленина, 1' })
    @IsString({ message: 'Адрес должен быть строкой' })
    @IsOptional()
    @MaxLength(255, { message: 'Адрес не более 255 символов' })
    address?: string;
}

export class AccountResponseDto {
    @ApiProperty({ description: 'ID организации' })
    id: string;

    @ApiProperty({ description: 'Название' })
    name: string;

    @ApiProperty({ description: 'ID владельца' })
    ownerId: string;

    @ApiProperty({ description: 'Активна ли организация' })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
}

export class PointResponseDto {
    @ApiProperty({ description: 'ID точки' })
    id: string;

    @ApiProperty({ description: 'Название' })
    name: string;

    @ApiPropertyOptional({ description: 'Адрес' })
    address: string | null;

    @ApiProperty({ description: 'ID организации' })
    accountId: string;

    @ApiProperty({ description: 'Активна ли точка' })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
}
