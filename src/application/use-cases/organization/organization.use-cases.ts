import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import {
    IAccountRepository,
    ACCOUNT_REPOSITORY,
} from '@domain/repositories/account.repository.interface';
import {
    IPointRepository,
    POINT_REPOSITORY,
} from '@domain/repositories/point.repository.interface';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@domain/repositories/user.repository.interface';
import { AccountEntity } from '@domain/entities/account.entity';
import { PointEntity } from '@domain/entities/point.entity';
import { UserRole } from '@domain/entities/user.entity';
import { CreateAccountDto, CreatePointDto } from '@application/dto/organization';

@Injectable()
export class CreateAccountUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(userId: string, dto: CreateAccountDto): Promise<AccountEntity> {
        return this.accountRepository.create({
            name: dto.name,
            ownerId: userId,
        });
    }
}

@Injectable()
export class GetAccountsUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string): Promise<AccountEntity[]> {
        const user = await this.userRepository.findById(userId);
        if (!user) return [];

        // Organizer: return owned accounts
        if (user.role === UserRole.ORGANIZER) {
            return this.accountRepository.findByOwnerId(userId);
        }

        // POINT_ADMIN: return the account they belong to
        if (user.role === UserRole.POINT_ADMIN && user.accountId) {
            const account = await this.accountRepository.findById(user.accountId);
            return account ? [account] : [];
        }

        return [];
    }
}

@Injectable()
export class GetAllAccountsUseCase {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(): Promise<AccountEntity[]> {
        return this.accountRepository.findAll();
    }
}

@Injectable()
export class CreatePointUseCase {
    constructor(
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(userId: string, accountId: string, dto: CreatePointDto): Promise<PointEntity> {
        // Verify user owns the account
        const accounts = await this.accountRepository.findByOwnerId(userId);
        const hasAccess = accounts.some((a) => a.id === accountId);

        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной организации');
        }

        return this.pointRepository.create({
            name: dto.name,
            address: dto.address,
            accountId,
        });
    }
}

@Injectable()
export class UpdatePointUseCase {
    constructor(
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: IAccountRepository,
    ) { }

    async execute(userId: string, pointId: string, dto: CreatePointDto): Promise<PointEntity> {
        // Verify user owns an account that contains this point
        const accounts = await this.accountRepository.findByOwnerId(userId);
        const point = await this.pointRepository.findById(pointId);

        if (!point) {
            throw new ForbiddenException('Точка не найдена');
        }

        const hasAccess = accounts.some((a) => a.id === point.accountId);
        if (!hasAccess) {
            throw new ForbiddenException('Нет доступа к данной точке');
        }

        return this.pointRepository.update(pointId, {
            name: dto.name,
            address: dto.address,
        });
    }
}

@Injectable()
export class GetPointsUseCase {
    constructor(
        @Inject(POINT_REPOSITORY)
        private readonly pointRepository: IPointRepository,
    ) { }

    async execute(userId: string): Promise<PointEntity[]> {
        return this.pointRepository.findByUserId(userId);
    }

    async executeByAccountId(accountId: string): Promise<PointEntity[]> {
        return this.pointRepository.findByAccountId(accountId);
    }
}
