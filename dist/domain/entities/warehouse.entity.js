"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseEntity = void 0;
class WarehouseEntity {
    constructor(id, name, pointId, address, description, isActive, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.pointId = pointId;
        this.address = address;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        return new WarehouseEntity(props.id, props.name, props.pointId, props.address ?? null, props.description ?? null, props.isActive ?? true, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
}
exports.WarehouseEntity = WarehouseEntity;
//# sourceMappingURL=warehouse.entity.js.map