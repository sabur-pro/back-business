"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointMemberEntity = void 0;
const user_entity_1 = require("./user.entity");
class PointMemberEntity {
    constructor(id, pointId, userId, role, createdAt, pointName) {
        this.id = id;
        this.pointId = pointId;
        this.userId = userId;
        this.role = role;
        this.createdAt = createdAt;
        this.pointName = pointName;
    }
    static create(props) {
        return new PointMemberEntity(props.id, props.pointId, props.userId, props.role ?? user_entity_1.UserRole.POINT_ADMIN, props.createdAt ?? new Date(), props.pointName);
    }
}
exports.PointMemberEntity = PointMemberEntity;
//# sourceMappingURL=point-member.entity.js.map