import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/domain/repositories/user.repository.interface';
import {
    IRefreshTokenRepository,
    REFRESH_TOKEN_REPOSITORY,
} from '@/domain/repositories/refresh-token.repository.interface';
import {
    IJwtTokenService,
    JWT_TOKEN_SERVICE,
} from '@/infrastructure/services/jwt-token.service';
import { UserRole } from '@/domain/entities/user.entity';
import { AuthResponseDto, UserResponseDto } from '@/application/dto/auth';

/**
 * Девелопер входит «под организатора».
 * Выдаётся токен, привязанный к организатору (sub = organizerId, role = ORGANIZER),
 * с признаком dev/devId — благодаря этому девелопер получает ВСЕ права организатора
 * плюс дополнительное право удалять заявки.
 */
@Injectable()
export class ActAsOrganizerUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(REFRESH_TOKEN_REPOSITORY)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        @Inject(JWT_TOKEN_SERVICE)
        private readonly jwtTokenService: IJwtTokenService,
    ) { }

    async execute(
        requester: { role: string; dev?: boolean; devId?: string; id: string },
        organizerId: string,
    ): Promise<AuthResponseDto> {
        // Кто именно инициирует: это должен быть девелопер (свежий логин) или уже
        // активная dev-сессия (для смены организатора без повторного входа).
        const isDeveloper = requester.role === UserRole.DEVELOPER || requester.dev === true;
        if (!isDeveloper) {
            throw new ForbiddenException('Доступно только девелоперу');
        }

        const developerId = requester.dev ? (requester.devId as string) : requester.id;

        // Проверяем, что девелопер действительно существует и активен
        const developer = await this.userRepository.findById(developerId);
        if (!developer || !developer.isActive || developer.role !== UserRole.DEVELOPER) {
            throw new ForbiddenException('Девелопер не найден или деактивирован');
        }

        // Целевой организатор
        const organizer = await this.userRepository.findById(organizerId);
        if (!organizer || organizer.role !== UserRole.ORGANIZER) {
            throw new NotFoundException('Организатор не найден');
        }
        if (!organizer.isActive) {
            throw new ForbiddenException('Аккаунт организатора деактивирован');
        }

        // Токен, скоупленный на организатора, но с dev-признаком
        const tokenPair = await this.jwtTokenService.generateTokenPair(
            organizer.id,
            organizer.email,
            organizer.role,
            { dev: true, devId: developerId },
        );

        await this.refreshTokenRepository.create({
            token: tokenPair.refreshToken,
            userId: organizer.id,
            expiresAt: this.jwtTokenService.getRefreshTokenExpirationDate(),
            impersonatorId: developerId,
        });

        const userResponse: UserResponseDto = {
            id: organizer.id,
            email: organizer.email,
            firstName: organizer.firstName,
            lastName: organizer.lastName,
            fullName: organizer.fullName,
            phone: organizer.phone || undefined,
            role: organizer.role,
            accountId: organizer.accountId || undefined,
            canAddProducts: organizer.canAddProducts,
            canEditProducts: organizer.canEditProducts,
            canDeleteProducts: organizer.canDeleteProducts,
            canManageCounterparties: organizer.canManageCounterparties,
            isDeveloper: true,
        };

        return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: userResponse,
        };
    }
}
