"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenEntity = void 0;
class RefreshTokenEntity {
    constructor(id, token, userId, expiresAt, createdAt) {
        this.id = id;
        this.token = token;
        this.userId = userId;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
    static create(props) {
        return new RefreshTokenEntity(props.id, props.token, props.userId, props.expiresAt, props.createdAt ?? new Date());
    }
}
exports.RefreshTokenEntity = RefreshTokenEntity;
//# sourceMappingURL=refresh-token.entity.js.map