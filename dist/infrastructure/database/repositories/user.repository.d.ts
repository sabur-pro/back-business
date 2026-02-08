import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository, CreateUserData, UpdateUserData } from '@/domain/repositories/user.repository.interface';
import { UserEntity } from '@/domain/entities/user.entity';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByAccountId(accountId: string): Promise<UserEntity[]>;
    create(data: CreateUserData): Promise<UserEntity>;
    update(id: string, data: UpdateUserData): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}
