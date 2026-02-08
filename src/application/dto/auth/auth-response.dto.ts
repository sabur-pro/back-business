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

    @ApiProperty({ description: 'Роль пользователя', enum: ['ORGANIZER', 'POINT_ADMIN'] })
    role: string;

    @ApiPropertyOptional({ description: 'ID организации (для сотрудников)' })
    accountId?: string;
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
