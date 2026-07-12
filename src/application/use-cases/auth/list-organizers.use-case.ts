import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import { UserRole } from '@/domain/entities/user.entity';
import { OrganizerListItemDto } from '@/application/dto/auth';

/**
 * Список всех организаторов — доступен только девелоперу
 * (в т.ч. когда он уже вошёл «под организатора» — dev === true).
 */
@Injectable()
export class ListOrganizersUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(isDeveloper: boolean): Promise<OrganizerListItemDto[]> {
        if (!isDeveloper) {
            throw new ForbiddenException('Доступно только девелоперу');
        }

        const organizers = await this.userRepository.findByRole(UserRole.ORGANIZER);

        return organizers.map((u) => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            phone: u.phone || undefined,
            accountId: u.accountId || undefined,
            isActive: u.isActive,
        }));
    }
}
