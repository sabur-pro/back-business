/**
 * ShopEmployee Entity
 * Represents an employee assigned to a shop
 */
export class ShopEmployeeEntity {
    constructor(
        public readonly id: string,
        public readonly warehouseId: string,
        public readonly userId: string,
        public readonly createdAt: Date,
        public readonly userName?: string,
        public readonly userEmail?: string,
        public readonly userPhone?: string | null,
        public readonly shopName?: string,
    ) { }

    static create(props: {
        id: string;
        warehouseId: string;
        userId: string;
        createdAt?: Date;
        userName?: string;
        userEmail?: string;
        userPhone?: string | null;
        shopName?: string;
    }): ShopEmployeeEntity {
        return new ShopEmployeeEntity(
            props.id,
            props.warehouseId,
            props.userId,
            props.createdAt ?? new Date(),
            props.userName,
            props.userEmail,
            props.userPhone,
            props.shopName,
        );
    }
}
