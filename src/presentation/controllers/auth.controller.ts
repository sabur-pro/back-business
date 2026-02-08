import {
    Controller,
    Post,
    Body,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import {
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GetMeUseCase,
} from '@/application/use-cases/auth';
import {
    RegisterDto,
    LoginDto,
    RefreshTokenDto,
    AuthResponseDto,
    TokenResponseDto,
    UserResponseDto,
} from '@/application/dto/auth';
import { Public } from '../decorators/public.decorator';
import { CurrentUser, CurrentUserData } from '../decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly getMeUseCase: GetMeUseCase,
    ) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({
        status: 201,
        description: 'Пользователь успешно зарегистрирован',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        return this.registerUseCase.execute(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Вход в систему' })
    @ApiResponse({
        status: 200,
        description: 'Успешная авторизация',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.loginUseCase.execute(dto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Обновление токенов' })
    @ApiResponse({
        status: 200,
        description: 'Токены успешно обновлены',
        type: TokenResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Недействительный refresh token' })
    async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
        return this.refreshTokenUseCase.execute(dto.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Выход из системы' })
    @ApiResponse({ status: 200, description: 'Успешный выход' })
    async logout(@Body() dto: RefreshTokenDto): Promise<{ message: string }> {
        await this.logoutUseCase.execute(dto.refreshToken);
        return { message: 'Выход выполнен успешно' };
    }

    @Post('logout-all')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Выход со всех устройств' })
    @ApiResponse({ status: 200, description: 'Выход со всех устройств выполнен' })
    async logoutAll(@CurrentUser() user: CurrentUserData): Promise<{ message: string }> {
        await this.logoutUseCase.executeAll(user.userId);
        return { message: 'Выход со всех устройств выполнен' };
    }

    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Получение данных текущего пользователя' })
    @ApiResponse({
        status: 200,
        description: 'Данные пользователя',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    async getMe(@CurrentUser('userId') userId: string): Promise<UserResponseDto> {
        return this.getMeUseCase.execute(userId);
    }
}
