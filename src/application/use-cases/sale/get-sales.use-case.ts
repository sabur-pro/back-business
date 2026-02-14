import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ISaleRepository,
    SALE_REPOSITORY,
    PaginatedSales,
} from '@domain/repositories/sale.repository.interface';
import { SaleEntity } from '@domain/entities/sale.entity';
import { SaleSearchQueryDto } from '@application/dto/sale';

@Injectable()
export class GetSalesUseCase {
    constructor(
        @Inject(SALE_REPOSITORY)
        private readonly saleRepository: ISaleRepository,
    ) { }

    async executeById(id: string): Promise<SaleEntity> {
        const sale = await this.saleRepository.findById(id);
        if (!sale) {
            throw new NotFoundException('Продажа не найдена');
        }
        return sale;
    }

    async executeByShopId(shopId: string, query: SaleSearchQueryDto): Promise<PaginatedSales> {
        return this.saleRepository.findByShopId(shopId, {
            page: query.page,
            limit: query.limit,
            status: query.status,
        });
    }

    async executeByAccountId(accountId: string, query: SaleSearchQueryDto): Promise<PaginatedSales> {
        return this.saleRepository.findByAccountId(accountId, {
            page: query.page,
            limit: query.limit,
            status: query.status,
        });
    }

    async executeByPointId(pointId: string, query: SaleSearchQueryDto): Promise<PaginatedSales> {
        return this.saleRepository.findByPointId(pointId, {
            page: query.page,
            limit: query.limit,
            status: query.status,
        });
    }
}
