import {
    Inject,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import {
    ICashRegisterRepository,
    CASH_REGISTER_REPOSITORY,
} from '@domain/repositories/cash-register.repository.interface';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { TransferToSafeDto, TransferFundsDto } from '@application/dto/cash-register';

@Injectable()
export class TransferToSafeUseCase {
    constructor(
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
    ) { }

    // Legacy method for backward compatibility (transfer-to-safe endpoint)
    async execute(dto: TransferToSafeDto) {
        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);

        if (dto.source === 'CASH') {
            if (Number(register.balance) < dto.amount) {
                throw new BadRequestException('Недостаточно наличных в кассе');
            }

            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.TRANSFER_TO_SAFE,
                amount: dto.amount,
                description: `Перевод в сейф из наличных: ${dto.amount}₽`,
            });

            await this.cashRegisterRepository.updateBalance(register.id, -dto.amount);
            await this.cashRegisterRepository.updateSafeBalance(register.id, dto.amount);
        } else if (dto.source === 'CARD') {
            if (Number(register.cardBalance) < dto.amount) {
                throw new BadRequestException('Недостаточно средств на карте');
            }

            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.CARD_TO_SAFE,
                amount: dto.amount,
                description: `Перевод в сейф с карты: ${dto.amount}₽`,
            });

            await this.cashRegisterRepository.updateCardBalance(register.id, -dto.amount);
            await this.cashRegisterRepository.updateSafeBalance(register.id, dto.amount);
        } else {
            throw new BadRequestException('Источник должен быть CASH или CARD');
        }

        return this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
    }

    // New generic transfer method supporting all 6 directions
    async transferFunds(dto: TransferFundsDto) {
        if (dto.from === dto.to) {
            throw new BadRequestException('Источник и назначение не могут совпадать');
        }

        const validAccounts = ['CASH', 'CARD', 'SAFE'];
        if (!validAccounts.includes(dto.from) || !validAccounts.includes(dto.to)) {
            throw new BadRequestException('Допустимые значения: CASH, CARD, SAFE');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);

        // Validate sufficient balance
        const balanceMap: Record<string, number> = {
            CASH: Number(register.balance),
            CARD: Number(register.cardBalance),
            SAFE: Number(register.safeBalance),
        };

        if (balanceMap[dto.from] < dto.amount) {
            const nameMap: Record<string, string> = {
                CASH: 'наличных',
                CARD: 'на карте',
                SAFE: 'в сейфе',
            };
            throw new BadRequestException(`Недостаточно средств ${nameMap[dto.from]}`);
        }

        // Determine transaction type
        const txTypeMap: Record<string, CashTransactionType> = {
            'CASH_SAFE': CashTransactionType.TRANSFER_TO_SAFE,
            'SAFE_CASH': CashTransactionType.TRANSFER_FROM_SAFE,
            'CARD_SAFE': CashTransactionType.CARD_TO_SAFE,
            'SAFE_CARD': CashTransactionType.SAFE_TO_CARD,
            'CASH_CARD': CashTransactionType.CASH_TO_CARD,
            'CARD_CASH': CashTransactionType.CARD_TO_CASH,
        };

        const txType = txTypeMap[`${dto.from}_${dto.to}`];
        if (!txType) {
            throw new BadRequestException('Неподдерживаемое направление перевода');
        }

        const nameMap: Record<string, string> = {
            CASH: 'наличные',
            CARD: 'карта',
            SAFE: 'сейф',
        };

        // Create transaction record
        await this.cashRegisterRepository.createTransaction({
            cashRegisterId: register.id,
            type: txType,
            amount: dto.amount,
            description: `Перевод ${nameMap[dto.from]} → ${nameMap[dto.to]}: ${dto.amount}₽`,
        });

        // Deduct from source
        const deductMap: Record<string, (id: string, amount: number) => Promise<any>> = {
            CASH: (id, amt) => this.cashRegisterRepository.updateBalance(id, -amt),
            CARD: (id, amt) => this.cashRegisterRepository.updateCardBalance(id, -amt),
            SAFE: (id, amt) => this.cashRegisterRepository.updateSafeBalance(id, -amt),
        };

        // Add to destination
        const addMap: Record<string, (id: string, amount: number) => Promise<any>> = {
            CASH: (id, amt) => this.cashRegisterRepository.updateBalance(id, amt),
            CARD: (id, amt) => this.cashRegisterRepository.updateCardBalance(id, amt),
            SAFE: (id, amt) => this.cashRegisterRepository.updateSafeBalance(id, amt),
        };

        await deductMap[dto.from](register.id, dto.amount);
        await addMap[dto.to](register.id, dto.amount);

        return this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
    }
}
