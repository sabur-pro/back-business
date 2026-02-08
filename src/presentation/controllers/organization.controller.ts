import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../decorators';
import { UserRole } from '@/domain/entities/user.entity';
import {
    CreateAccountDto,
    CreatePointDto,
    AccountResponseDto,
    PointResponseDto,
} from '@application/dto/organization';
import {
    CreateAccountUseCase,
    GetAccountsUseCase,
    CreatePointUseCase,
    GetPointsUseCase,
    UpdatePointUseCase,
} from '@application/use-cases/organization';

@ApiTags('Организации')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationController {
    constructor(
        private readonly createAccountUseCase: CreateAccountUseCase,
        private readonly getAccountsUseCase: GetAccountsUseCase,
        private readonly createPointUseCase: CreatePointUseCase,
        private readonly getPointsUseCase: GetPointsUseCase,
        private readonly updatePointUseCase: UpdatePointUseCase,
    ) { }

    @Post('accounts')
    @Roles(UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Создать организацию' })
    @ApiResponse({ status: 201, description: 'Организация создана', type: AccountResponseDto })
    async createAccount(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateAccountDto,
    ): Promise<AccountResponseDto> {
        return this.createAccountUseCase.execute(userId, dto);
    }

    @Get('accounts')
    @ApiOperation({ summary: 'Получить организации пользователя' })
    @ApiResponse({ status: 200, description: 'Список организаций', type: [AccountResponseDto] })
    async getAccounts(@CurrentUser('id') userId: string): Promise<AccountResponseDto[]> {
        return this.getAccountsUseCase.execute(userId);
    }

    @Post('accounts/:accountId/points')
    @Roles(UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Создать точку в организации' })
    @ApiResponse({ status: 201, description: 'Точка создана', type: PointResponseDto })
    async createPoint(
        @CurrentUser('id') userId: string,
        @Param('accountId') accountId: string,
        @Body() dto: CreatePointDto,
    ): Promise<PointResponseDto> {
        return this.createPointUseCase.execute(userId, accountId, dto);
    }

    @Get('points')
    @ApiOperation({ summary: 'Получить все точки пользователя' })
    @ApiResponse({ status: 200, description: 'Список точек', type: [PointResponseDto] })
    async getPoints(@CurrentUser('id') userId: string): Promise<PointResponseDto[]> {
        return this.getPointsUseCase.execute(userId);
    }

    @Get('accounts/:accountId/points')
    @ApiOperation({ summary: 'Получить точки организации' })
    @ApiResponse({ status: 200, description: 'Список точек', type: [PointResponseDto] })
    async getPointsByAccount(@Param('accountId') accountId: string): Promise<PointResponseDto[]> {
        return this.getPointsUseCase.executeByAccountId(accountId);
    }

    @Put('points/:pointId')
    @Roles(UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Обновить точку' })
    @ApiResponse({ status: 200, description: 'Точка обновлена', type: PointResponseDto })
    async updatePoint(
        @CurrentUser('id') userId: string,
        @Param('pointId') pointId: string,
        @Body() dto: CreatePointDto,
    ): Promise<PointResponseDto> {
        return this.updatePointUseCase.execute(userId, pointId, dto);
    }
}
