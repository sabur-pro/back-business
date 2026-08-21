import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
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
    AddShopEmployeeDto,
    ShopEmployeeResponseDto,
    ArrivalDaysQueryDto,
    ArrivalDayDto,
    ArrivalsQueryDto,
    ArrivalsResponseDto,
    CreateReturnDto,
    ReturnResponseDto,
} from '@application/dto/shop';
import {
    AddShopEmployeeUseCase,
    RemoveShopEmployeeUseCase,
    GetShopEmployeesUseCase,
    GetShopArrivalsUseCase,
    CreateShopReturnUseCase,
} from '@application/use-cases/shop';

@ApiTags('Магазины')
@ApiBearerAuth()
@Controller('shops')
export class ShopController {
    constructor(
        private readonly addShopEmployeeUseCase: AddShopEmployeeUseCase,
        private readonly removeShopEmployeeUseCase: RemoveShopEmployeeUseCase,
        private readonly getShopEmployeesUseCase: GetShopEmployeesUseCase,
        private readonly getShopArrivalsUseCase: GetShopArrivalsUseCase,
        private readonly createShopReturnUseCase: CreateShopReturnUseCase,
    ) { }

    @Post('employees')
    @ApiOperation({ summary: 'Добавить сотрудника в магазин' })
    @ApiResponse({ status: 201, description: 'Сотрудник добавлен', type: ShopEmployeeResponseDto })
    @ApiResponse({ status: 404, description: 'Магазин или сотрудник не найден' })
    @ApiResponse({ status: 409, description: 'Сотрудник уже назначен' })
    async addEmployee(
        @CurrentUser('id') userId: string,
        @Body() dto: AddShopEmployeeDto,
    ): Promise<ShopEmployeeResponseDto> {
        return this.addShopEmployeeUseCase.execute(userId, dto);
    }

    @Get('employees/:shopId')
    @ApiOperation({ summary: 'Получить сотрудников магазина' })
    @ApiResponse({ status: 200, description: 'Список сотрудников', type: [ShopEmployeeResponseDto] })
    @ApiResponse({ status: 404, description: 'Магазин не найден' })
    async getEmployees(
        @Param('shopId') shopId: string,
    ): Promise<ShopEmployeeResponseDto[]> {
        return this.getShopEmployeesUseCase.executeByShopId(shopId);
    }

    @Get('my-shops')
    @ApiOperation({ summary: 'Получить магазины текущего пользователя (как сотрудника)' })
    @ApiResponse({ status: 200, description: 'Список назначений', type: [ShopEmployeeResponseDto] })
    async getMyShops(
        @CurrentUser('id') userId: string,
    ): Promise<ShopEmployeeResponseDto[]> {
        return this.getShopEmployeesUseCase.executeByUserId(userId);
    }

    @Get(':shopId/arrival-days')
    @ApiOperation({ summary: 'Дни поступления товара в магазин со сводкой' })
    @ApiResponse({ status: 200, description: 'Список дней', type: [ArrivalDayDto] })
    @ApiResponse({ status: 403, description: 'Нет доступа к точке' })
    async getArrivalDays(
        @CurrentUser('id') userId: string,
        @Param('shopId') shopId: string,
        @Query() query: ArrivalDaysQueryDto,
    ): Promise<ArrivalDayDto[]> {
        return this.getShopArrivalsUseCase.executeDays(userId, shopId, query);
    }

    @Get(':shopId/arrivals')
    @ApiOperation({ summary: 'Товары, поступившие в магазин за указанный день' })
    @ApiResponse({ status: 200, description: 'Партии за день', type: ArrivalsResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа к точке' })
    async getArrivals(
        @CurrentUser('id') userId: string,
        @Param('shopId') shopId: string,
        @Query() query: ArrivalsQueryDto,
    ): Promise<ArrivalsResponseDto> {
        return this.getShopArrivalsUseCase.executeByDate(userId, shopId, query);
    }

    @Post(':shopId/returns')
    @ApiOperation({ summary: 'Оформить возврат остатка из магазина' })
    @ApiResponse({ status: 201, description: 'Возврат оформлен', type: ReturnResponseDto })
    @ApiResponse({ status: 400, description: 'Недостаточно товара для возврата' })
    @ApiResponse({ status: 403, description: 'Нет доступа к точке' })
    async createReturn(
        @CurrentUser('id') userId: string,
        @Param('shopId') shopId: string,
        @Body() dto: CreateReturnDto,
    ): Promise<ReturnResponseDto> {
        return this.createShopReturnUseCase.execute(userId, shopId, dto);
    }

    @Delete('employees/:shopId/:userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить сотрудника из магазина' })
    @ApiResponse({ status: 204, description: 'Сотрудник удален' })
    @ApiResponse({ status: 404, description: 'Назначение не найдено' })
    async removeEmployee(
        @CurrentUser('id') currentUserId: string,
        @Param('shopId') shopId: string,
        @Param('userId') employeeUserId: string,
    ): Promise<void> {
        return this.removeShopEmployeeUseCase.execute(currentUserId, shopId, employeeUserId);
    }
}
