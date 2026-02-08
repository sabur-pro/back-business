import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'Пароль (минимум 8 символов)' })
    @IsString()
    @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
    @MaxLength(50, { message: 'Пароль должен быть максимум 50 символов' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Пароль должен содержать заглавную, строчную букву и цифру',
    })
    password: string;

    @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
    @IsString()
    @MinLength(2, { message: 'Имя должно быть минимум 2 символа' })
    @MaxLength(50, { message: 'Имя должно быть максимум 50 символов' })
    firstName: string;

    @ApiProperty({ example: 'Петров', description: 'Фамилия пользователя' })
    @IsString()
    @MinLength(2, { message: 'Фамилия должна быть минимум 2 символа' })
    @MaxLength(50, { message: 'Фамилия должна быть максимум 50 символов' })
    lastName: string;

    @ApiProperty({ example: '+7 (999) 123-45-67', description: 'Телефон', required: false })
    @IsOptional()
    @IsString()
    phone?: string;
}
