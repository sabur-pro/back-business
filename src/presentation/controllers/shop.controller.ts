import {
    Controller,
    Get,
    Post,
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
    AddShopEmployeeDto,
    ShopEmployeeResponseDto,
} from '@application/dto/shop';
import {
    AddShopEmployeeUseCase,
    RemoveShopEmployeeUseCase,
    GetShopEmployeesUseCase,
} from '@application/use-cases/shop';

@ApiTags('Магазины')
@ApiBearerAuth()
@Controller('shops')
export class ShopController {
    constructor(
        private readonly addShopEmployeeUseCase: AddShopEmployeeUseCase,
        private readonly removeShopEmployeeUseCase: RemoveShopEmployeeUseCase,
        private readonly getShopEmployeesUseCase: GetShopEmployeesUseCase,
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
