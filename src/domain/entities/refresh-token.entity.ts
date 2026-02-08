/**
 * RefreshToken domain entity
 */
export class RefreshTokenEntity {
    constructor(
        public readonly id: string,
        public readonly token: string,
        public readonly userId: string,
        public readonly expiresAt: Date,
        public readonly createdAt: Date,
    ) { }

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    static create(props: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt?: Date;
    }): RefreshTokenEntity {
        return new RefreshTokenEntity(
            props.id,
            props.token,
            props.userId,
            props.expiresAt,
            props.createdAt ?? new Date(),
        );
    }
}
