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
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import { CounterpartyEntity } from '@domain/entities/counterparty.entity';
import { CreateCounterpartyDto } from '@application/dto/counterparty';

@Injectable()
export class CreateCounterpartyUseCase {
    constructor(
        @Inject(COUNTERPARTY_REPOSITORY)
        private readonly counterpartyRepository: ICounterpartyRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async execute(userId: string, dto: CreateCounterpartyDto): Promise<CounterpartyEntity> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ForbiddenException('Пользователь не найден');
        }

        if (!user.accountId) {
            throw new ForbiddenException('Пользователь не привязан к организации');
        }

        return this.counterpartyRepository.create({
            name: dto.name,
            phone: dto.phone,
            note: dto.note,
            type: dto.type,
            accountId: user.accountId,
        });
    }
}
