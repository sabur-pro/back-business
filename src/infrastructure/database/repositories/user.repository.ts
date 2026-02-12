import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository, CreateUserData, UpdateUserData } from '@/domain/repositories/user.repository.interface';
import { UserEntity, UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return UserEntity.create({
            ...user,
            role: user.role as UserRole,
        });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        return UserEntity.create({
            ...user,
            role: user.role as UserRole,
        });
    }

    async findByAccountId(accountId: string): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
        });

        return users.map((u) => UserEntity.create({
            ...u,
            role: u.role as UserRole,
        }));
    }

    async create(data: CreateUserData): Promise<UserEntity> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone ?? null,
                role: data.role ?? 'ORGANIZER',
                accountId: data.accountId ?? null,
                canCreateShipment: data.canCreateShipment ?? false,
                canReceiveShipment: data.canReceiveShipment ?? false,
                isActive: data.isActive ?? true,
            },
        });

        return UserEntity.create({
            ...user,
            role: user.role as UserRole,
        });
    }

    async update(id: string, data: UpdateUserData): Promise<UserEntity> {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...(data.email && { email: data.email }),
                ...(data.password && { password: data.password }),
                ...(data.firstName && { firstName: data.firstName }),
                ...(data.lastName && { lastName: data.lastName }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.role && { role: data.role }),
                ...(data.accountId !== undefined && { accountId: data.accountId }),
                ...(data.canCreateShipment !== undefined && { canCreateShipment: data.canCreateShipment }),
                ...(data.canReceiveShipment !== undefined && { canReceiveShipment: data.canReceiveShipment }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        });

        return UserEntity.create({
            ...user,
            role: user.role as UserRole,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }
}
