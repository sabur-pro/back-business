import { PrismaService } from '../prisma/prisma.service';
import { IPointRepository, CreatePointData, UpdatePointData } from '@domain/repositories/point.repository.interface';
import { PointEntity } from '@domain/entities/point.entity';
export declare class PointRepository implements IPointRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<PointEntity | null>;
    findByAccountId(accountId: string): Promise<PointEntity[]>;
    findByUserId(userId: string): Promise<PointEntity[]>;
    create(data: CreatePointData): Promise<PointEntity>;
    update(id: string, data: UpdatePointData): Promise<PointEntity>;
    delete(id: string): Promise<void>;
}
