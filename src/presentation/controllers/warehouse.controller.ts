import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators';
import {
    CreateWarehouseDto,
    UpdateWarehouseDto,
    WarehouseResponseDto,
} from '@application/dto/warehouse';
import {
    CreateWarehouseUseCase,
    GetWarehousesUseCase,
    UpdateWarehouseUseCase,
    DeleteWarehouseUseCase,
} from '@application/use-cases/warehouse';

@ApiTags('Склады')
@ApiBearerAuth()
@Controller('warehouses')
export class WarehouseController {
    constructor(
        private readonly createWarehouseUseCase: CreateWarehouseUseCase,
        private readonly getWarehousesUseCase: GetWarehousesUseCase,
        private readonly updateWarehouseUseCase: UpdateWarehouseUseCase,
        private readonly deleteWarehouseUseCase: DeleteWarehouseUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать новый склад' })
    @ApiResponse({ status: 201, description: 'Склад создан', type: WarehouseResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа к точке' })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateWarehouseDto,
    ): Promise<WarehouseResponseDto> {
        return this.createWarehouseUseCase.execute(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все склады пользователя' })
    @ApiResponse({ status: 200, description: 'Список складов', type: [WarehouseResponseDto] })
    async getAll(@CurrentUser('id') userId: string): Promise<WarehouseResponseDto[]> {
        return this.getWarehousesUseCase.execute(userId);
    }

    @Get('point/:pointId')
    @ApiOperation({ summary: 'Получить склады по точке' })
    @ApiResponse({ status: 200, description: 'Список складов', type: [WarehouseResponseDto] })
    async getByPoint(@Param('pointId') pointId: string): Promise<WarehouseResponseDto[]> {
        return this.getWarehousesUseCase.executeByPointId(pointId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Обновить склад' })
    @ApiResponse({ status: 200, description: 'Склад обновлен', type: WarehouseResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа к складу' })
    @ApiResponse({ status: 404, description: 'Склад не найден' })
    async update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateWarehouseDto,
    ): Promise<WarehouseResponseDto> {
        return this.updateWarehouseUseCase.execute(userId, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить склад' })
    @ApiResponse({ status: 204, description: 'Склад удален' })
    @ApiResponse({ status: 403, description: 'Нет доступа к складу' })
    @ApiResponse({ status: 404, description: 'Склад не найден' })
    async delete(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.deleteWarehouseUseCase.execute(userId, id);
    }
}
