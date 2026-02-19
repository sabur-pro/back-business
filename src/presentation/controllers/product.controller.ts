import {
    Controller,
    Get,
    Post,
    Put,
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
    CreateProductDto,
    UpdateProductDto,
    BatchCreateProductsDto,
    ProductResponseDto,
    BatchCreateProductsResponseDto,
    ProductSearchQueryDto,
    PaginatedProductsResponseDto,
} from '@application/dto/product';
import {
    CreateProductUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    BatchCreateProductsUseCase,
} from '@application/use-cases/product';

@ApiTags('Товары')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly getProductsUseCase: GetProductsUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly batchCreateProductsUseCase: BatchCreateProductsUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать товар' })
    @ApiResponse({ status: 201, description: 'Товар создан', type: ProductResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 409, description: 'Товар с таким артикулом уже существует' })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateProductDto,
    ): Promise<ProductResponseDto> {
        return this.createProductUseCase.execute(userId, dto);
    }

    @Post('batch')
    @ApiOperation({ summary: 'Поточное добавление товаров (приход)' })
    @ApiResponse({ status: 201, description: 'Товары созданы', type: BatchCreateProductsResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 409, description: 'Дублирующиеся артикулы' })
    async batchCreate(
        @CurrentUser('id') userId: string,
        @Body() dto: BatchCreateProductsDto,
    ): Promise<BatchCreateProductsResponseDto> {
        return this.batchCreateProductsUseCase.execute(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все товары пользователя' })
    @ApiResponse({ status: 200, description: 'Список товаров', type: [ProductResponseDto] })
    async getAll(@CurrentUser('id') userId: string): Promise<ProductResponseDto[]> {
        return this.getProductsUseCase.execute(userId);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Получить статистику товаров (уникальные, коробки, пары)' })
    @ApiResponse({ status: 200, description: 'Статистика товаров' })
    async getStats(
        @CurrentUser('id') userId: string,
    ) {
        return this.getProductsUseCase.executeStats(userId);
    }

    @Get('search-all')
    @ApiOperation({ summary: 'Поиск товаров по всем складам пользователя с пагинацией' })
    @ApiResponse({ status: 200, description: 'Список товаров с пагинацией', type: PaginatedProductsResponseDto })
    async searchAll(
        @CurrentUser('id') userId: string,
        @Query() query: ProductSearchQueryDto,
    ): Promise<PaginatedProductsResponseDto> {
        return this.getProductsUseCase.executeSearchAll(userId, {
            page: query.page,
            limit: query.limit,
            search: query.search,
        });
    }

    @Get('search/:accountId')
    @ApiOperation({ summary: 'Поиск товаров с пагинацией' })
    @ApiResponse({ status: 200, description: 'Список товаров с пагинацией', type: PaginatedProductsResponseDto })
    async searchProducts(
        @CurrentUser('id') userId: string,
        @Param('accountId') accountId: string,
        @Query() query: ProductSearchQueryDto,
    ): Promise<PaginatedProductsResponseDto> {
        return this.getProductsUseCase.executePaginated(userId, accountId, {
            page: query.page,
            limit: query.limit,
            search: query.search,
        });
    }

    @Get('warehouse/:warehouseId')
    @ApiOperation({ summary: 'Поиск товаров по складу с пагинацией' })
    @ApiResponse({ status: 200, description: 'Список товаров с пагинацией', type: PaginatedProductsResponseDto })
    async searchByWarehouse(
        @CurrentUser('id') userId: string,
        @Param('warehouseId') warehouseId: string,
        @Query() query: ProductSearchQueryDto,
    ): Promise<PaginatedProductsResponseDto> {
        return this.getProductsUseCase.executeByWarehouseIdPaginated(userId, warehouseId, {
            page: query.page,
            limit: query.limit,
            search: query.search,
            zeroBoxes: query.zeroBoxes,
        });
    }

    @Get('point/:pointId')
    @ApiOperation({ summary: 'Получить товары по точке' })
    @ApiResponse({ status: 200, description: 'Список товаров', type: [ProductResponseDto] })
    async getByPoint(
        @CurrentUser('id') userId: string,
        @Param('pointId') pointId: string,
    ): Promise<ProductResponseDto[]> {
        return this.getProductsUseCase.executeByPointId(userId, pointId);
    }

    @Get('point/:pointId/search')
    @ApiOperation({ summary: 'Поиск товаров по точке с пагинацией (все склады)' })
    @ApiResponse({ status: 200, description: 'Список товаров с пагинацией', type: PaginatedProductsResponseDto })
    async searchByPoint(
        @CurrentUser('id') userId: string,
        @Param('pointId') pointId: string,
        @Query() query: ProductSearchQueryDto,
    ): Promise<PaginatedProductsResponseDto> {
        return this.getProductsUseCase.executeByPointIdPaginated(userId, pointId, {
            page: query.page,
            limit: query.limit,
            search: query.search,
            zeroBoxes: query.zeroBoxes,
        });
    }

    @Put(':id')
    @ApiOperation({ summary: 'Обновить товар' })
    @ApiResponse({ status: 200, description: 'Товар обновлен', type: ProductResponseDto })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Товар не найден' })
    async update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ): Promise<ProductResponseDto> {
        return this.updateProductUseCase.execute(userId, id, dto);
    }

    @Delete('batch')
    @ApiOperation({ summary: 'Удалить несколько товаров' })
    @ApiResponse({ status: 200, description: 'Товары удалены' })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Товар не найден' })
    async deleteMany(
        @CurrentUser('id') userId: string,
        @Body() body: { ids: string[] },
    ): Promise<{ deleted: number }> {
        return this.deleteProductUseCase.executeMany(userId, body.ids);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить товар' })
    @ApiResponse({ status: 204, description: 'Товар удален' })
    @ApiResponse({ status: 403, description: 'Нет доступа' })
    @ApiResponse({ status: 404, description: 'Товар не найден' })
    async delete(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.deleteProductUseCase.execute(userId, id);
    }
}
