import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

// ==================== ADD SHOP EMPLOYEE ====================

export class AddShopEmployeeDto {
    @ApiProperty({ description: 'ID магазина (warehouse с типом SHOP)', example: 'uuid' })
    @IsString({ message: 'ID магазина должен быть строкой' })
    @IsNotEmpty({ message: 'ID магазина обязателен' })
    shopId: string;

    @ApiProperty({ description: 'ID сотрудника', example: 'uuid' })
    @IsString({ message: 'ID сотрудника должен быть строкой' })
    @IsNotEmpty({ message: 'ID сотрудника обязателен' })
    userId: string;
}

// ==================== RESPONSE ====================

export class ShopEmployeeResponseDto {
    @ApiProperty({ description: 'ID записи' })
    id: string;

    @ApiProperty({ description: 'ID магазина' })
    warehouseId: string;

    @ApiProperty({ description: 'ID сотрудника' })
    userId: string;

    @ApiProperty({ description: 'Дата добавления' })
    createdAt: Date;

    @ApiPropertyOptional({ description: 'Имя сотрудника' })
    userName?: string;

    @ApiPropertyOptional({ description: 'Email сотрудника' })
    userEmail?: string;

    @ApiPropertyOptional({ description: 'Телефон сотрудника' })
    userPhone?: string | null;

    @ApiPropertyOptional({ description: 'Название магазина' })
    shopName?: string;
}
