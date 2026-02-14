import {
    Inject,
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import { CounterpartyType } from '@domain/entities/counterparty.entity';
import { CounterpartyTransactionType } from '@domain/entities/counterparty-transaction.entity';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { PayCounterpartyDebtDto } from '@application/dto/counterparty';

@Injectable()
export class PayCounterpartyDebtUseCase {
    constructor(
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
    ) { }

    async execute(dto: PayCounterpartyDebtDto) {
        const counterparty = await this.counterpartyRepository.findById(dto.counterpartyId);
        if (!counterparty) {
            throw new NotFoundException('Контрагент не найден');
        }

        if (dto.amount <= 0) {
            throw new BadRequestException('Сумма оплаты должна быть больше 0');
        }

        if (counterparty.type === CounterpartyType.SUPPLIER) {
            // We pay supplier → decrease our debt to them
            // balance decreases (we owe less)
            await this.counterpartyRepository.createTransaction({
                counterpartyId: counterparty.id,
                type: CounterpartyTransactionType.PAYMENT_OUT,
                amount: dto.amount,
                description: dto.description ?? `Оплата поставщику: ${counterparty.name}`,
            });
            await this.counterpartyRepository.updateBalance(counterparty.id, -dto.amount);

            // If paying from cash register
            if (dto.shopId) {
                const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
                await this.cashRegisterRepository.createTransaction({
                    cashRegisterId: register.id,
                    type: CashTransactionType.PAYMENT_TO_SUPPLIER,
                    amount: dto.amount,
                    description: dto.description ?? `Оплата поставщику: ${counterparty.name}`,
                    counterpartyId: counterparty.id,
                });
                await this.cashRegisterRepository.updateBalance(register.id, -dto.amount);
            }
        } else if (counterparty.type === CounterpartyType.CLIENT) {
            // Client pays us → decrease their debt to us
            // balance decreases (they owe less)
            await this.counterpartyRepository.createTransaction({
                counterpartyId: counterparty.id,
                type: CounterpartyTransactionType.PAYMENT_IN,
                amount: dto.amount,
                description: dto.description ?? `Оплата от клиента: ${counterparty.name}`,
            });
            await this.counterpartyRepository.updateBalance(counterparty.id, -dto.amount);

            // If receiving to cash register
            if (dto.shopId) {
                const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
                await this.cashRegisterRepository.createTransaction({
                    cashRegisterId: register.id,
                    type: CashTransactionType.PAYMENT_FROM_CLIENT,
                    amount: dto.amount,
                    description: dto.description ?? `Оплата от клиента: ${counterparty.name}`,
                    counterpartyId: counterparty.id,
                });
                await this.cashRegisterRepository.updateBalance(register.id, dto.amount);
            }
        }

        const updated = await this.counterpartyRepository.findById(counterparty.id);
        if (!updated) {
            throw new NotFoundException('Контрагент не найден после обновления');
        }
        return updated;
    }
}
