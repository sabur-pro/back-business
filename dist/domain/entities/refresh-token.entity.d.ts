export declare class RefreshTokenEntity {
    readonly id: string;
    readonly token: string;
    readonly userId: string;
    readonly expiresAt: Date;
    readonly createdAt: Date;
    constructor(id: string, token: string, userId: string, expiresAt: Date, createdAt: Date);
    isExpired(): boolean;
    static create(props: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt?: Date;
    }): RefreshTokenEntity;
}
