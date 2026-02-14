import {
    Inject,
    Injectable,
    NotFoundException,
    BadRequestException,
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
import { CounterpartyType } from '@domain/entities/counterparty.entity';
import { CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { PayFromCashRegisterDto, ReceiveToCashRegisterDto } from '@application/dto/cash-register';

@Injectable()
export class PayFromCashRegisterUseCase {
    constructor(
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
    ) { }

    async paySupplier(dto: PayFromCashRegisterDto) {
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const counterparty = await this.counterpartyRepository.findById(dto.counterpartyId);
        if (!counterparty) {
            throw new NotFoundException('Контрагент не найден');
        }
        if (counterparty.type !== CounterpartyType.SUPPLIER) {
            throw new BadRequestException('Контрагент не является поставщиком');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);

        if (register.balance < dto.amount) {
            throw new BadRequestException(
                `Недостаточно средств в кассе. Баланс: ${register.balance}, Запрошено: ${dto.amount}`,
            );
        }

        // Create cash transaction
        await this.cashRegisterRepository.createTransaction({
            cashRegisterId: register.id,
            type: CashTransactionType.PAYMENT_TO_SUPPLIER,
            amount: dto.amount,
            description: dto.description ?? `Оплата поставщику: ${counterparty.name}`,
            counterpartyId: counterparty.id,
        });

        // Update cash register balance
        await this.cashRegisterRepository.updateBalance(register.id, -dto.amount);

        // Create counterparty transaction and update balance
        await this.counterpartyRepository.createTransaction({
            counterpartyId: counterparty.id,
            type: CounterpartyTransactionType.PAYMENT_OUT,
            amount: dto.amount,
            description: dto.description ?? `Оплата из кассы магазина`,
        });
        await this.counterpartyRepository.updateBalance(counterparty.id, -dto.amount);

        return this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
    }

    async receiveFromClient(dto: ReceiveToCashRegisterDto) {
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const counterparty = await this.counterpartyRepository.findById(dto.counterpartyId);
        if (!counterparty) {
            throw new NotFoundException('Контрагент не найден');
        }
        if (counterparty.type !== CounterpartyType.CLIENT) {
            throw new BadRequestException('Контрагент не является клиентом');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);

        // Create cash transaction
        await this.cashRegisterRepository.createTransaction({
            cashRegisterId: register.id,
            type: CashTransactionType.PAYMENT_FROM_CLIENT,
            amount: dto.amount,
            description: dto.description ?? `Оплата от клиента: ${counterparty.name}`,
            counterpartyId: counterparty.id,
        });

        // Update cash register balance
        await this.cashRegisterRepository.updateBalance(register.id, dto.amount);

        // Create counterparty transaction and update balance
        await this.counterpartyRepository.createTransaction({
            counterpartyId: counterparty.id,
            type: CounterpartyTransactionType.PAYMENT_IN,
            amount: dto.amount,
            description: dto.description ?? `Оплата в кассу магазина`,
        });
        await this.counterpartyRepository.updateBalance(counterparty.id, -dto.amount);

        return this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
    }
}
