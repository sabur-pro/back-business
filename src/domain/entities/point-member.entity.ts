import { UserRole } from './user.entity';

/**
 * Point Member Entity
 * Represents user assignment to a point
 */
export class PointMemberEntity {
    constructor(
        public readonly id: string,
        public readonly pointId: string,
        public readonly userId: string,
        public readonly role: UserRole,
        public readonly createdAt: Date,
        public readonly pointName?: string,
    ) { }

    static create(props: {
        id: string;
        pointId: string;
        userId: string;
        role?: string;
        createdAt?: Date;
        pointName?: string;
    }): PointMemberEntity {
        return new PointMemberEntity(
            props.id,
            props.pointId,
            props.userId,
            (props.role as UserRole) ?? UserRole.POINT_ADMIN,
            props.createdAt ?? new Date(),
            props.pointName,
        );
    }
}
