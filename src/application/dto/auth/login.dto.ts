import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'Пароль' })
    @IsString()
    @MinLength(1, { message: 'Пароль обязателен' })
    password: string;
}
