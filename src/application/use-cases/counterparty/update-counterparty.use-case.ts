import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import { CounterpartyEntity } from '@domain/entities/counterparty.entity';
import { UpdateCounterpartyDto } from '@application/dto/counterparty';

@Injectable()
export class UpdateCounterpartyUseCase {
    constructor(
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
    ) { }

    async execute(id: string, dto: UpdateCounterpartyDto): Promise<CounterpartyEntity> {
        const counterparty = await this.counterpartyRepository.findById(id);
        if (!counterparty) {
            throw new NotFoundException('Контрагент не найден');
        }

        return this.counterpartyRepository.update(id, {
            name: dto.name,
            phone: dto.phone,
            note: dto.note,
            isActive: dto.isActive,
        });
    }
}
