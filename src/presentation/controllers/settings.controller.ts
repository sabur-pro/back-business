import {
    Controller,
    Get,
    Put,
    Body,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser, Roles } from '../decorators';
import { UserRole } from '@/domain/entities/user.entity';
import { UpdateOrgSettingsDto, OrgSettingsResponseDto } from '@application/dto/settings';
import { GetOrgSettingsUseCase, UpdateOrgSettingsUseCase } from '@application/use-cases/settings';

@ApiTags('Настройки')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
    constructor(
        private readonly getOrgSettingsUseCase: GetOrgSettingsUseCase,
        private readonly updateOrgSettingsUseCase: UpdateOrgSettingsUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Получить настройки организации' })
    @ApiResponse({ status: 200, description: 'Настройки', type: OrgSettingsResponseDto })
    async getSettings(@CurrentUser('id') userId: string): Promise<OrgSettingsResponseDto> {
        return this.getOrgSettingsUseCase.execute(userId);
    }

    @Put()
    @Roles(UserRole.ORGANIZER)
    @ApiOperation({ summary: 'Обновить настройки организации' })
    @ApiResponse({ status: 200, description: 'Настройки обновлены', type: OrgSettingsResponseDto })
    async updateSettings(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateOrgSettingsDto,
    ): Promise<OrgSettingsResponseDto> {
        return this.updateOrgSettingsUseCase.execute(userId, dto);
    }
}
