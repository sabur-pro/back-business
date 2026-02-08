import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Email сотрудника', example: 'employee@example.com' })
    @IsEmail({}, { message: 'Некорректный email' })
    @IsNotEmpty({ message: 'Email обязателен' })
    email: string;

    @ApiProperty({ description: 'Пароль', example: 'password123' })
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль минимум 6 символов' })
    password: string;

    @ApiProperty({ description: 'Имя', example: 'Иван' })
    @IsString({ message: 'Имя должно быть строкой' })
    @IsNotEmpty({ message: 'Имя обязательно' })
    @MaxLength(50)
    firstName: string;

    @ApiProperty({ description: 'Фамилия', example: 'Петров' })
    @IsString({ message: 'Фамилия должна быть строкой' })
    @IsNotEmpty({ message: 'Фамилия обязательна' })
    @MaxLength(50)
    lastName: string;

    @ApiPropertyOptional({ description: 'Телефон', example: '+7 999 123-45-67' })
    @IsString({ message: 'Телефон должен быть строкой' })
    @IsOptional()
    phone?: string;
}

export class AssignPointDto {
    @ApiProperty({ description: 'ID точки' })
    @IsString({ message: 'ID точки должен быть строкой' })
    @IsNotEmpty({ message: 'ID точки обязателен' })
    pointId: string;
}

export class EmployeeResponseDto {
    @ApiProperty({ description: 'ID сотрудника' })
    id: string;

    @ApiProperty({ description: 'Email' })
    email: string;

    @ApiProperty({ description: 'Имя' })
    firstName: string;

    @ApiProperty({ description: 'Фамилия' })
    lastName: string;

    @ApiProperty({ description: 'Полное имя' })
    fullName: string;

    @ApiPropertyOptional({ description: 'Телефон' })
    phone?: string;

    @ApiProperty({ description: 'Роль' })
    role: string;

    @ApiProperty({ description: 'Активен' })
    isActive: boolean;

    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
}

export class PointAssignmentResponseDto {
    @ApiProperty({ description: 'ID назначения' })
    id: string;

    @ApiProperty({ description: 'ID точки' })
    pointId: string;

    @ApiProperty({ description: 'Название точки' })
    pointName: string;

    @ApiProperty({ description: 'ID сотрудника' })
    userId: string;

    @ApiProperty({ description: 'Роль' })
    role: string;

    @ApiProperty({ description: 'Дата назначения' })
    createdAt: Date;
}
