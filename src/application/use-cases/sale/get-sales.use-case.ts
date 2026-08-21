import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ISaleRepository,
    SALE_REPOSITORY,
    PaginatedSales,
    SalesSummary,
} from '@domain/repositories/sale.repository.interface';
import { SaleEntity } from '@domain/entities/sale.entity';
import { SaleSearchQueryDto } from '@application/dto/sale';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import {
    IAccountRepository,
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import { UserRole } from '@domain/entities/user.entity';

@Injectable()
export class GetSalesUseCase {
    constructor(
        @Inject(SALE_REPOSITORY)
        private readonly saleRepository: ISaleRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
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

    async executeSalesSummary(userId: string, period: string): Promise<SalesSummary> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const accountIds: string[] = [];
        if (user.role === UserRole.ORGANIZER) {
            const accounts = await this.accountRepository.findByOwnerId(userId);
            accountIds.push(...accounts.map((a) => a.id));
        } else if (user.accountId) {
            accountIds.push(user.accountId);
        }

        if (accountIds.length === 0) {
            return { totalActualSales: 0, salesCount: 0, netProfit: 0 };
        }

        const to = new Date();
        const from = new Date();

        switch (period) {
            case 'day':
                from.setHours(0, 0, 0, 0);
                break;
            case 'week':
                const day = from.getDay();
                const diff = from.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                from.setDate(diff);
                from.setHours(0, 0, 0, 0);
                break;
            case 'month':
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                break;
            case 'year':
                from.setMonth(0, 1);
                from.setHours(0, 0, 0, 0);
                break;
            default:
                from.setHours(0, 0, 0, 0); // default to today
        }

        return this.saleRepository.getSummaryByAccountIds(accountIds, from, to);
    }
}
