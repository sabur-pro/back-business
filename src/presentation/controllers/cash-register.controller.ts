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
    PayFromCashRegisterDto,
    ReceiveToCashRegisterDto,
    TransferToSafeDto,
    TransferFundsDto,
    CreateExpenseDto,
    CreatePayoutDto,
    CashTransactionSearchQueryDto,
    ExpenseSearchQueryDto,
    PayoutSearchQueryDto,
    CashRegisterResponseDto,
    CashRegisterSummaryResponseDto,
    PaginatedCashTransactionsResponseDto,
    ExpenseResponseDto,
    PaginatedExpensesResponseDto,
    PayoutResponseDto,
    PaginatedPayoutsResponseDto,
} from '@application/dto/cash-register';
import {
    GetCashRegisterUseCase,
    PayFromCashRegisterUseCase,
    TransferToSafeUseCase,
    CreateExpenseUseCase,
    PayoutUseCase,
} from '@application/use-cases/cash-register';

@ApiTags('Касса')
@ApiBearerAuth()
@Controller('cash-register')
export class CashRegisterController {
    constructor(
        private readonly getCashRegisterUseCase: GetCashRegisterUseCase,
        private readonly payFromCashRegisterUseCase: PayFromCashRegisterUseCase,
        private readonly transferToSafeUseCase: TransferToSafeUseCase,
        private readonly createExpenseUseCase: CreateExpenseUseCase,
        private readonly payoutUseCase: PayoutUseCase,
    ) { }

    @Get('shop/:shopId')
    @ApiOperation({ summary: 'Получить кассу магазина с итогами долгов' })
    @ApiResponse({ status: 200, description: 'Касса магазина', type: CashRegisterSummaryResponseDto })
    async getByShop(
        @Param('shopId') shopId: string,
    ): Promise<CashRegisterSummaryResponseDto> {
        return this.getCashRegisterUseCase.executeByShopId(shopId);
    }

    @Get('shop/:shopId/transactions')
    @ApiOperation({ summary: 'Получить историю операций кассы' })
    @ApiResponse({ status: 200, description: 'Список операций', type: PaginatedCashTransactionsResponseDto })
    async getTransactions(
        @Param('shopId') shopId: string,
        @Query() query: CashTransactionSearchQueryDto,
    ): Promise<PaginatedCashTransactionsResponseDto> {
        return this.getCashRegisterUseCase.executeTransactions(shopId, query);
    }

    @Post('pay-supplier')
    @ApiOperation({ summary: 'Оплатить поставщику из кассы' })
    @ApiResponse({ status: 200, description: 'Оплата произведена', type: CashRegisterResponseDto })
    async paySupplier(
        @Body() dto: PayFromCashRegisterDto,
    ): Promise<CashRegisterResponseDto> {
        return this.payFromCashRegisterUseCase.paySupplier(dto);
    }

    @Post('receive-from-client')
    @ApiOperation({ summary: 'Получить оплату от клиента в кассу' })
    @ApiResponse({ status: 200, description: 'Оплата получена', type: CashRegisterResponseDto })
    async receiveFromClient(
        @Body() dto: ReceiveToCashRegisterDto,
    ): Promise<CashRegisterResponseDto> {
        return this.payFromCashRegisterUseCase.receiveFromClient(dto);
    }

    // ==================== TRANSFERS ====================

    @Post('transfer-to-safe')
    @ApiOperation({ summary: 'Перевести деньги в сейф (из наличных или карты)' })
    @ApiResponse({ status: 200, description: 'Перевод выполнен', type: CashRegisterResponseDto })
    async transferToSafe(
        @Body() dto: TransferToSafeDto,
    ): Promise<CashRegisterResponseDto> {
        return this.transferToSafeUseCase.execute(dto);
    }

    @Post('transfer')
    @ApiOperation({ summary: 'Перевод между счетами (наличные, карта, сейф)' })
    @ApiResponse({ status: 200, description: 'Перевод выполнен', type: CashRegisterResponseDto })
    async transferFunds(
        @Body() dto: TransferFundsDto,
    ): Promise<CashRegisterResponseDto> {
        return this.transferToSafeUseCase.transferFunds(dto);
    }

    // ==================== EXPENSES ====================

    @Post('expense')
    @ApiOperation({ summary: 'Создать расход' })
    @ApiResponse({ status: 201, description: 'Расход создан', type: ExpenseResponseDto })
    async createExpense(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateExpenseDto,
    ): Promise<ExpenseResponseDto> {
        return this.createExpenseUseCase.execute(userId, dto);
    }

    @Get('shop/:shopId/expenses')
    @ApiOperation({ summary: 'Получить расходы магазина' })
    @ApiResponse({ status: 200, description: 'Список расходов', type: PaginatedExpensesResponseDto })
    async getExpenses(
        @Param('shopId') shopId: string,
        @Query() query: ExpenseSearchQueryDto,
    ): Promise<PaginatedExpensesResponseDto> {
        return this.createExpenseUseCase.getExpenses(shopId, query);
    }

    // ==================== PAYOUTS ====================

    @Post('payout')
    @ApiOperation({ summary: 'Создать выдачу организатору' })
    @ApiResponse({ status: 201, description: 'Выдача создана', type: PayoutResponseDto })
    async createPayout(
        @CurrentUser('id') userId: string,
        @Body() dto: CreatePayoutDto,
    ): Promise<PayoutResponseDto> {
        return this.payoutUseCase.create(userId, dto);
    }

    @Put('payout/:id/approve')
    @ApiOperation({ summary: 'Одобрить выдачу (только организатор)' })
    @ApiResponse({ status: 200, description: 'Выдача одобрена', type: PayoutResponseDto })
    async approvePayout(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ): Promise<PayoutResponseDto> {
        return this.payoutUseCase.approve(userId, id);
    }

    @Put('payout/:id/reject')
    @ApiOperation({ summary: 'Отклонить выдачу (только организатор)' })
    @ApiResponse({ status: 200, description: 'Выдача отклонена', type: PayoutResponseDto })
    async rejectPayout(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ): Promise<PayoutResponseDto> {
        return this.payoutUseCase.reject(userId, id);
    }

    @Get('payouts/shop/:shopId')
    @ApiOperation({ summary: 'Получить выдачи магазина' })
    @ApiResponse({ status: 200, description: 'Список выдач', type: PaginatedPayoutsResponseDto })
    async getPayoutsByShop(
        @Param('shopId') shopId: string,
        @Query() query: PayoutSearchQueryDto,
    ): Promise<PaginatedPayoutsResponseDto> {
        return this.payoutUseCase.getByShopId(shopId, query);
    }

    @Get('payouts/account/:accountId')
    @ApiOperation({ summary: 'Получить выдачи аккаунта (для организатора)' })
    @ApiResponse({ status: 200, description: 'Список выдач', type: PaginatedPayoutsResponseDto })
    async getPayoutsByAccount(
        @Param('accountId') accountId: string,
        @Query() query: PayoutSearchQueryDto,
    ): Promise<PaginatedPayoutsResponseDto> {
        return this.payoutUseCase.getByAccountId(accountId, query);
    }

    @Get('payout/:id')
    @ApiOperation({ summary: 'Получить выдачу по ID' })
    @ApiResponse({ status: 200, description: 'Выдача', type: PayoutResponseDto })
    async getPayoutById(
        @Param('id') id: string,
    ): Promise<PayoutResponseDto> {
        return this.payoutUseCase.getById(id);
    }
}
