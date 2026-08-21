import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { UserResponseDto } from '@/application/dto/auth';

@Injectable()
export class GetMeUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string, isDeveloper = false): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            phone: user.phone || undefined,
            role: user.role,
            accountId: user.accountId || undefined,
            canAddProducts: user.canAddProducts,
            canEditProducts: user.canEditProducts,
            canDeleteProducts: user.canDeleteProducts,
            canManageCounterparties: user.canManageCounterparties,
            // Признак сессии девелопера берётся из JWT (dev), а не из БД
            isDeveloper: isDeveloper || user.isDeveloper,
        };
    }
}
