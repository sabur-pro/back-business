import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { CashRegisterSummaryResponseDto } from '@application/dto/cash-register';
import { CashTransactionSearchQueryDto } from '@application/dto/cash-register';

@Injectable()
export class GetCashRegisterUseCase {
    constructor(
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async executeByShopId(shopId: string): Promise<CashRegisterSummaryResponseDto> {
        const shop = await this.warehouseRepository.findById(shopId);
        if (!shop) {
            throw new NotFoundException('Магазин не найден');
        }
        if (shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Указанный объект не является магазином');
        }

        const point = await this.pointRepository.findById(shop.pointId);
        if (!point) {
            throw new NotFoundException('Точка не найдена');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(shopId);

        // Get supplier and client totals for this account
        const suppliers = await this.counterpartyRepository.findByAccountId(point.accountId, {
            type: 'SUPPLIER',
            limit: 1000,
        });
        const clients = await this.counterpartyRepository.findByAccountId(point.accountId, {
            type: 'CLIENT',
            limit: 1000,
        });

        const totalOwedToSuppliers = suppliers.items.reduce((sum, s) => sum + Math.max(s.balance, 0), 0);
        const totalOwedByClients = clients.items.reduce((sum, c) => sum + Math.max(c.balance, 0), 0);

        return {
            register: {
                id: register.id,
                shopId: register.shopId,
                balance: register.balance,
                cardBalance: register.cardBalance,
                safeBalance: register.safeBalance,
                shopName: register.shopName,
                createdAt: register.createdAt,
                updatedAt: register.updatedAt,
            },
            totalOwedToSuppliers: Math.round(totalOwedToSuppliers * 100) / 100,
            totalOwedByClients: Math.round(totalOwedByClients * 100) / 100,
        };
    }

    async executeTransactions(shopId: string, query: CashTransactionSearchQueryDto) {
        const register = await this.cashRegisterRepository.findOrCreateByShopId(shopId);
        return this.cashRegisterRepository.findTransactions(register.id, {
            page: query.page,
            limit: query.limit,
        });
    }
}
