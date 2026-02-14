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
    IWarehouseRepository,
    WAREHOUSE_REPOSITORY,
} from '@domain/repositories/warehouse.repository.interface';
import { CashTransactionType } from '@domain/entities/cash-transaction.entity';
import { WarehouseType } from '@domain/entities/warehouse.entity';
import { TransferToSafeDto } from '@application/dto/cash-register';

@Injectable()
export class TransferToSafeUseCase {
    constructor(
        @Inject(CASH_REGISTER_REPOSITORY)
        private readonly cashRegisterRepository: ICashRegisterRepository,
        @Inject(WAREHOUSE_REPOSITORY)
        private readonly warehouseRepository: IWarehouseRepository,
    ) { }

    async execute(dto: TransferToSafeDto) {
        const shop = await this.warehouseRepository.findById(dto.shopId);
        if (!shop || shop.type !== WarehouseType.SHOP) {
            throw new NotFoundException('Магазин не найден');
        }

        const register = await this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);

        if (dto.source === 'CASH') {
            if (register.balance < dto.amount) {
                throw new BadRequestException(
                    `Недостаточно наличных. Баланс: ${register.balance}, Запрошено: ${dto.amount}`,
                );
            }

            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.TRANSFER_TO_SAFE,
                amount: dto.amount,
                description: `Перевод из наличных в сейф`,
            });

            await this.cashRegisterRepository.updateBalance(register.id, -dto.amount);
            await this.cashRegisterRepository.updateSafeBalance(register.id, dto.amount);
        } else if (dto.source === 'CARD') {
            if (register.cardBalance < dto.amount) {
                throw new BadRequestException(
                    `Недостаточно средств на карте. Баланс: ${register.cardBalance}, Запрошено: ${dto.amount}`,
                );
            }

            await this.cashRegisterRepository.createTransaction({
                cashRegisterId: register.id,
                type: CashTransactionType.CARD_TO_SAFE,
                amount: dto.amount,
                description: `Перевод с карты в сейф`,
            });

            await this.cashRegisterRepository.updateCardBalance(register.id, -dto.amount);
            await this.cashRegisterRepository.updateSafeBalance(register.id, dto.amount);
        } else {
            throw new BadRequestException('Источник должен быть CASH или CARD');
        }

        return this.cashRegisterRepository.findOrCreateByShopId(dto.shopId);
    }
}
