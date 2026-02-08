/**
 * User roles enum
 */
export enum UserRole {
    ORGANIZER = 'ORGANIZER',
    POINT_ADMIN = 'POINT_ADMIN',
}

/**
 * User domain entity
 * Represents a user in the system with business logic
 */
export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly password: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly phone: string | null,
        public readonly role: UserRole,
        public readonly accountId: string | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get isOrganizer(): boolean {
        return this.role === UserRole.ORGANIZER;
    }

    get isPointAdmin(): boolean {
        return this.role === UserRole.POINT_ADMIN;
    }

    static create(props: {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string | null;
        role?: UserRole;
        accountId?: string | null;
        isActive?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): UserEntity {
        return new UserEntity(
            props.id,
            props.email,
            props.password,
            props.firstName,
            props.lastName,
            props.phone ?? null,
            props.role ?? UserRole.ORGANIZER,
            props.accountId ?? null,
            props.isActive ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
