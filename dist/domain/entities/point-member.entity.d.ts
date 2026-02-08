import { UserRole } from './user.entity';
export declare class PointMemberEntity {
    readonly id: string;
    readonly pointId: string;
    readonly userId: string;
    readonly role: UserRole;
    readonly createdAt: Date;
    readonly pointName?: string | undefined;
    constructor(id: string, pointId: string, userId: string, role: UserRole, createdAt: Date, pointName?: string | undefined);
    static create(props: {
        id: string;
        pointId: string;
        userId: string;
        role?: string;
        createdAt?: Date;
        pointName?: string;
    }): PointMemberEntity;
}
