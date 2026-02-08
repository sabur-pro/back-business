import { PrismaService } from '../prisma/prisma.service';
import { IPointMemberRepository, CreatePointMemberData } from '@/domain/repositories/point-member.repository.interface';
import { PointMemberEntity } from '@/domain/entities/point-member.entity';
export declare class PointMemberRepository implements IPointMemberRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<PointMemberEntity | null>;
    findByPointId(pointId: string): Promise<PointMemberEntity[]>;
    findByUserId(userId: string): Promise<PointMemberEntity[]>;
    findByPointAndUser(pointId: string, userId: string): Promise<PointMemberEntity | null>;
    create(data: CreatePointMemberData): Promise<PointMemberEntity>;
    delete(id: string): Promise<void>;
    deleteByPointAndUser(pointId: string, userId: string): Promise<void>;
}
