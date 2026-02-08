import { PointMemberEntity } from '../entities/point-member.entity';
export interface CreatePointMemberData {
    pointId: string;
    userId: string;
    role?: string;
}
export interface IPointMemberRepository {
    findById(id: string): Promise<PointMemberEntity | null>;
    findByPointId(pointId: string): Promise<PointMemberEntity[]>;
    findByUserId(userId: string): Promise<PointMemberEntity[]>;
    findByPointAndUser(pointId: string, userId: string): Promise<PointMemberEntity | null>;
    create(data: CreatePointMemberData): Promise<PointMemberEntity>;
    delete(id: string): Promise<void>;
    deleteByPointAndUser(pointId: string, userId: string): Promise<void>;
}
export declare const POINT_MEMBER_REPOSITORY: unique symbol;
