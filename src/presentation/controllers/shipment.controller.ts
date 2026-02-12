import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators';
import {
    CreateShipmentDto,
    AcceptShipmentDto,
    ShipmentSearchQueryDto,
    ShipmentResponseDto,
    PaginatedShipmentsResponseDto,
} from '@application/dto/shipment';
import {
    CreateShipmentUseCase,
    AcceptShipmentUseCase,
    CancelShipmentUseCase,
    GetShipmentsUseCase,
} from '@application/use-cases/shipment';

@ApiTags('Отправки')
@ApiBearerAuth()
@Controller('shipments')
export class ShipmentController {
    constructor(
        private readonly createShipmentUseCase: CreateShipmentUseCase,
        private readonly acceptShipmentUseCase: AcceptShipmentUseCase,
        private readonly cancelShipmentUseCase: CancelShipmentUseCase,
        private readonly getShipmentsUseCase: GetShipmentsUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать отправку (отправить товары)' })
    @ApiResponse({ status: 201, description: 'Отправка создана', type: ShipmentResponseDto })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Сущность не найдена' })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateShipmentDto,
    ): Promise<ShipmentResponseDto> {
        return this.createShipmentUseCase.execute(userId, dto) as any;
    }

    @Put(':id/accept')
    @ApiOperation({ summary: 'Принять отправку (получатель подтверждает)' })
    @ApiResponse({ status: 200, description: 'Отправка принята', type: ShipmentResponseDto })
    @ApiResponse({ status: 400, description: 'Некорректный статус' })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Отправка не найдена' })
    async accept(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: AcceptShipmentDto,
    ): Promise<ShipmentResponseDto> {
        return this.acceptShipmentUseCase.execute(userId, id, dto) as any;
    }

    @Put(':id/cancel')
    @ApiOperation({ summary: 'Отменить отправку (вернуть товары отправителю)' })
    @ApiResponse({ status: 200, description: 'Отправка отменена', type: ShipmentResponseDto })
    @ApiResponse({ status: 400, description: 'Некорректный статус' })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Отправка не найдена' })
    async cancel(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ): Promise<ShipmentResponseDto> {
        return this.cancelShipmentUseCase.execute(userId, id) as any;
    }

    @Get('outgoing/:accountId')
    @ApiOperation({ summary: 'Список исходящих отправок' })
    @ApiResponse({ status: 200, description: 'Список отправок', type: PaginatedShipmentsResponseDto })
    async getOutgoing(
        @CurrentUser('id') userId: string,
        @Param('accountId') accountId: string,
        @Query() query: ShipmentSearchQueryDto,
    ): Promise<PaginatedShipmentsResponseDto> {
        return this.getShipmentsUseCase.getOutgoing(userId, accountId, query) as any;
    }

    @Get('incoming/:accountId')
    @ApiOperation({ summary: 'Список входящих отправок' })
    @ApiResponse({ status: 200, description: 'Список отправок', type: PaginatedShipmentsResponseDto })
    async getIncoming(
        @CurrentUser('id') userId: string,
        @Param('accountId') accountId: string,
        @Query() query: ShipmentSearchQueryDto,
    ): Promise<PaginatedShipmentsResponseDto> {
        return this.getShipmentsUseCase.getIncoming(userId, accountId, query) as any;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить отправку по ID' })
    @ApiResponse({ status: 200, description: 'Отправка', type: ShipmentResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Отправка не найдена' })
    async getById(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ): Promise<ShipmentResponseDto> {
        return this.getShipmentsUseCase.getById(userId, id) as any;
    }
}
