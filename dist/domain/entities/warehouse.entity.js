"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseEntity = exports.WarehouseType = void 0;
var WarehouseType;
(function (WarehouseType) {
    WarehouseType["WAREHOUSE"] = "WAREHOUSE";
    WarehouseType["SHOP"] = "SHOP";
})(WarehouseType || (exports.WarehouseType = WarehouseType = {}));
class WarehouseEntity {
    constructor(id, name, type, pointId, address, description, isActive, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.pointId = pointId;
        this.address = address;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        return new WarehouseEntity(props.id, props.name, props.type ?? WarehouseType.WAREHOUSE, props.pointId, props.address ?? null, props.description ?? null, props.isActive ?? true, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
}
exports.WarehouseEntity = WarehouseEntity;
//# sourceMappingURL=warehouse.entity.js.map