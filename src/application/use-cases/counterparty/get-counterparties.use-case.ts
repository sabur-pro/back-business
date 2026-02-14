import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import {
    ICounterpartyRepository,
    COUNTERPARTY_REPOSITORY,
} from '@domain/repositories/counterparty.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import { CounterpartyEntity } from '@domain/entities/counterparty.entity';
import { CounterpartySearchQueryDto, TransactionSearchQueryDto } from '@application/dto/counterparty';

@Injectable()
export class GetCounterpartiesUseCase {
    constructor(
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async executeByAccountId(accountId: string, query: CounterpartySearchQueryDto) {
        return this.counterpartyRepository.findByAccountId(accountId, {
            page: query.page,
            limit: query.limit,
            type: query.type,
            search: query.search,
        });
    }

    async executeById(id: string) {
        const counterparty = await this.counterpartyRepository.findById(id);
        if (!counterparty) {
            throw new NotFoundException('Контрагент не найден');
        }
        return counterparty;
    }

    async executeTransactions(counterpartyId: string, query: TransactionSearchQueryDto) {
        const counterparty = await this.counterpartyRepository.findById(counterpartyId);
        if (!counterparty) {
            throw new NotFoundException('Контрагент не найден');
        }
        return this.counterpartyRepository.findTransactions(counterpartyId, {
            page: query.page,
            limit: query.limit,
        });
    }
}
