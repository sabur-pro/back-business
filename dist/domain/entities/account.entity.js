"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountEntity = void 0;
class AccountEntity {
    constructor(id, name, ownerId, isActive, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        return new AccountEntity(props.id, props.name, props.ownerId, props.isActive ?? true, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
}
exports.AccountEntity = AccountEntity;
//# sourceMappingURL=account.entity.js.map