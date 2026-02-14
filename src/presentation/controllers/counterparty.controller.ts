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
    CreateCounterpartyDto,
    UpdateCounterpartyDto,
    PayCounterpartyDebtDto,
    CounterpartySearchQueryDto,
    TransactionSearchQueryDto,
    CounterpartyResponseDto,
    PaginatedCounterpartiesResponseDto,
    PaginatedCounterpartyTransactionsResponseDto,
} from '@application/dto/counterparty';
import {
    CreateCounterpartyUseCase,
    GetCounterpartiesUseCase,
    UpdateCounterpartyUseCase,
    PayCounterpartyDebtUseCase,
} from '@application/use-cases/counterparty';

@ApiTags('Контрагенты')
@ApiBearerAuth()
@Controller('counterparties')
export class CounterpartyController {
    constructor(
        private readonly createCounterpartyUseCase: CreateCounterpartyUseCase,
        private readonly getCounterpartiesUseCase: GetCounterpartiesUseCase,
        private readonly updateCounterpartyUseCase: UpdateCounterpartyUseCase,
        private readonly payCounterpartyDebtUseCase: PayCounterpartyDebtUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать контрагента (поставщик/клиент)' })
    @ApiResponse({ status: 201, description: 'Контрагент создан', type: CounterpartyResponseDto })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateCounterpartyDto,
    ): Promise<CounterpartyResponseDto> {
        return this.createCounterpartyUseCase.execute(userId, dto);
    }

    @Get('account/:accountId')
    @ApiOperation({ summary: 'Получить контрагентов аккаунта' })
    @ApiResponse({ status: 200, description: 'Список контрагентов', type: PaginatedCounterpartiesResponseDto })
    async getByAccount(
        @Param('accountId') accountId: string,
        @Query() query: CounterpartySearchQueryDto,
    ): Promise<PaginatedCounterpartiesResponseDto> {
        return this.getCounterpartiesUseCase.executeByAccountId(accountId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить контрагента по ID' })
    @ApiResponse({ status: 200, description: 'Контрагент', type: CounterpartyResponseDto })
    @ApiResponse({ status: 404, description: 'Контрагент не найден' })
    async getById(@Param('id') id: string): Promise<CounterpartyResponseDto> {
        return this.getCounterpartiesUseCase.executeById(id);
    }

    @Get(':id/transactions')
    @ApiOperation({ summary: 'Получить историю операций контрагента' })
    @ApiResponse({ status: 200, description: 'Список операций', type: PaginatedCounterpartyTransactionsResponseDto })
    async getTransactions(
        @Param('id') id: string,
        @Query() query: TransactionSearchQueryDto,
    ): Promise<PaginatedCounterpartyTransactionsResponseDto> {
        return this.getCounterpartiesUseCase.executeTransactions(id, query);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Обновить контрагента' })
    @ApiResponse({ status: 200, description: 'Контрагент обновлён', type: CounterpartyResponseDto })
    @ApiResponse({ status: 404, description: 'Контрагент не найден' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCounterpartyDto,
    ): Promise<CounterpartyResponseDto> {
        return this.updateCounterpartyUseCase.execute(id, dto);
    }

    @Post('pay-debt')
    @ApiOperation({ summary: 'Оплатить долг контрагенту / получить оплату от контрагента' })
    @ApiResponse({ status: 200, description: 'Долг оплачен', type: CounterpartyResponseDto })
    async payDebt(
        @Body() dto: PayCounterpartyDebtDto,
    ): Promise<CounterpartyResponseDto> {
        return this.payCounterpartyDebtUseCase.execute(dto);
    }
}
