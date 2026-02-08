"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointEntity = void 0;
class PointEntity {
    constructor(id, name, address, accountId, isActive, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.accountId = accountId;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        return new PointEntity(props.id, props.name, props.address ?? null, props.accountId, props.isActive ?? true, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
}
exports.PointEntity = PointEntity;
//# sourceMappingURL=point.entity.js.map