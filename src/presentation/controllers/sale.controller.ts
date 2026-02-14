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
    CreateSaleDto,
    SaleSearchQueryDto,
    SaleResponseDto,
    PaginatedSalesResponseDto,
} from '@application/dto/sale';
import {
    CreateSaleUseCase,
    GetSalesUseCase,
    CancelSaleUseCase,
} from '@application/use-cases/sale';

@ApiTags('Продажи')
@ApiBearerAuth()
@Controller('sales')
export class SaleController {
    constructor(
        private readonly createSaleUseCase: CreateSaleUseCase,
        private readonly getSalesUseCase: GetSalesUseCase,
        private readonly cancelSaleUseCase: CancelSaleUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать продажу' })
    @ApiResponse({ status: 201, description: 'Продажа создана', type: SaleResponseDto })
    @ApiResponse({ status: 400, description: 'Невалидные данные' })
    @ApiResponse({ status: 404, description: 'Магазин или товар не найден' })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateSaleDto,
    ): Promise<SaleResponseDto> {
        return this.createSaleUseCase.execute(userId, dto);
    }

    @Get('shop/:shopId')
    @ApiOperation({ summary: 'Получить продажи магазина' })
    @ApiResponse({ status: 200, description: 'Список продаж', type: PaginatedSalesResponseDto })
    async getByShop(
        @Param('shopId') shopId: string,
        @Query() query: SaleSearchQueryDto,
    ): Promise<PaginatedSalesResponseDto> {
        return this.getSalesUseCase.executeByShopId(shopId, query);
    }

    @Get('account/:accountId')
    @ApiOperation({ summary: 'Получить продажи аккаунта' })
    @ApiResponse({ status: 200, description: 'Список продаж', type: PaginatedSalesResponseDto })
    async getByAccount(
        @Param('accountId') accountId: string,
        @Query() query: SaleSearchQueryDto,
    ): Promise<PaginatedSalesResponseDto> {
        return this.getSalesUseCase.executeByAccountId(accountId, query);
    }

    @Get('point/:pointId')
    @ApiOperation({ summary: 'Получить продажи точки' })
    @ApiResponse({ status: 200, description: 'Список продаж', type: PaginatedSalesResponseDto })
    async getByPoint(
        @Param('pointId') pointId: string,
        @Query() query: SaleSearchQueryDto,
    ): Promise<PaginatedSalesResponseDto> {
        return this.getSalesUseCase.executeByPointId(pointId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить продажу по ID' })
    @ApiResponse({ status: 200, description: 'Продажа', type: SaleResponseDto })
    @ApiResponse({ status: 404, description: 'Продажа не найдена' })
    async getById(@Param('id') id: string): Promise<SaleResponseDto> {
        return this.getSalesUseCase.executeById(id);
    }

    @Put(':id/cancel')
    @ApiOperation({ summary: 'Отменить продажу' })
    @ApiResponse({ status: 200, description: 'Продажа отменена', type: SaleResponseDto })
    @ApiResponse({ status: 404, description: 'Продажа не найдена' })
    @ApiResponse({ status: 400, description: 'Продажа уже отменена' })
    async cancel(@Param('id') id: string): Promise<SaleResponseDto> {
        return this.cancelSaleUseCase.execute(id);
    }
}
