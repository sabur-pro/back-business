"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ORGANIZER"] = "ORGANIZER";
    UserRole["POINT_ADMIN"] = "POINT_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
class UserEntity {
    constructor(id, email, password, firstName, lastName, phone, role, accountId, canCreateShipment, canReceiveShipment, isActive, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.role = role;
        this.accountId = accountId;
        this.canCreateShipment = canCreateShipment;
        this.canReceiveShipment = canReceiveShipment;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get isOrganizer() {
        return this.role === UserRole.ORGANIZER;
    }
    get isPointAdmin() {
        return this.role === UserRole.POINT_ADMIN;
    }
    static create(props) {
        return new UserEntity(props.id, props.email, props.password, props.firstName, props.lastName, props.phone ?? null, props.role ?? UserRole.ORGANIZER, props.accountId ?? null, props.canCreateShipment ?? false, props.canReceiveShipment ?? false, props.isActive ?? true, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map