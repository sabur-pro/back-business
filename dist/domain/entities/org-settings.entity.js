"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgSettingsEntity = void 0;
class OrgSettingsEntity {
    constructor(id, accountId, canAddEmployees, canAddPoints, canAddWarehouses, canAddProducts, createdAt, updatedAt) {
        this.id = id;
        this.accountId = accountId;
        this.canAddEmployees = canAddEmployees;
        this.canAddPoints = canAddPoints;
        this.canAddWarehouses = canAddWarehouses;
        this.canAddProducts = canAddProducts;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        return new OrgSettingsEntity(props.id, props.accountId, props.canAddEmployees ?? true, props.canAddPoints ?? true, props.canAddWarehouses ?? true, props.canAddProducts ?? false, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
}
exports.OrgSettingsEntity = OrgSettingsEntity;
//# sourceMappingURL=org-settings.entity.js.map