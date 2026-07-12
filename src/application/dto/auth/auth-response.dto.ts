import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ description: 'ID пользователя' })
    id: string;

    @ApiProperty({ description: 'Email пользователя' })
    email: string;

    @ApiProperty({ description: 'Имя пользователя' })
    firstName: string;

    @ApiProperty({ description: 'Фамилия пользователя' })
    lastName: string;

    @ApiProperty({ description: 'Полное имя пользователя' })
    fullName: string;

    @ApiPropertyOptional({ description: 'Телефон' })
    phone?: string;

    @ApiProperty({ description: 'Роль пользователя', enum: ['DEVELOPER', 'ORGANIZER', 'POINT_ADMIN'] })
    role: string;

    @ApiPropertyOptional({ description: 'ID организации (для сотрудников)' })
    accountId?: string;

    @ApiPropertyOptional({ description: 'Может добавлять товары' })
    canAddProducts?: boolean;

    @ApiPropertyOptional({ description: 'Может управлять контрагентами' })
    canManageCounterparties?: boolean;

    @ApiPropertyOptional({ description: 'Сессия девелопера «под организатором» (даёт право удалять заявки)' })
    isDeveloper?: boolean;
}

export class OrganizerListItemDto {
    @ApiProperty({ description: 'ID пользователя-организатора' })
    id: string;

    @ApiProperty({ description: 'Email' })
    email: string;

    @ApiProperty({ description: 'Полное имя' })
    fullName: string;

    @ApiPropertyOptional({ description: 'Телефон' })
    phone?: string;

    @ApiPropertyOptional({ description: 'ID организации' })
    accountId?: string;

    @ApiProperty({ description: 'Активен ли аккаунт' })
    isActive: boolean;
}

export class AuthResponseDto {
    @ApiProperty({ description: 'JWT Access Token' })
    accessToken: string;

    @ApiProperty({ description: 'Refresh Token для обновления access token' })
    refreshToken: string;

    @ApiProperty({ description: 'Данные пользователя', type: UserResponseDto })
    user: UserResponseDto;
}

export class TokenResponseDto {
    @ApiProperty({ description: 'JWT Access Token' })
    accessToken: string;

    @ApiProperty({ description: 'Refresh Token' })
    refreshToken: string;
}
