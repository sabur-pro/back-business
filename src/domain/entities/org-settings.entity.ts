/**
 * OrgSettings Entity
 * Stores feature toggle states per organization account
 */
export class OrgSettingsEntity {
    constructor(
        public readonly id: string,
        public readonly accountId: string,
        public readonly canAddEmployees: boolean,
        public readonly canAddPoints: boolean,
        public readonly canAddWarehouses: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(props: {
        id: string;
        accountId: string;
        canAddEmployees?: boolean;
        canAddPoints?: boolean;
        canAddWarehouses?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): OrgSettingsEntity {
        return new OrgSettingsEntity(
            props.id,
            props.accountId,
            props.canAddEmployees ?? true,
            props.canAddPoints ?? true,
            props.canAddWarehouses ?? true,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
}
