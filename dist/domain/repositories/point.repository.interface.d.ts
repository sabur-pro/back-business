import { PointEntity } from '../entities/point.entity';
export interface CreatePointData {
    name: string;
    address?: string | null;
    accountId: string;
    isActive?: boolean;
}
export interface UpdatePointData {
    name?: string;
    address?: string | null;
    isActive?: boolean;
}
export interface IPointRepository {
    findById(id: string): Promise<PointEntity | null>;
    findByAccountId(accountId: string): Promise<PointEntity[]>;
    findByUserId(userId: string): Promise<PointEntity[]>;
    create(data: CreatePointData): Promise<PointEntity>;
    update(id: string, data: UpdatePointData): Promise<PointEntity>;
    delete(id: string): Promise<void>;
}
export declare const POINT_REPOSITORY: unique symbol;
