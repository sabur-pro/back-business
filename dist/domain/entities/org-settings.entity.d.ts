export declare class OrgSettingsEntity {
    readonly id: string;
    readonly accountId: string;
    readonly canAddEmployees: boolean;
    readonly canAddPoints: boolean;
    readonly canAddWarehouses: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, accountId: string, canAddEmployees: boolean, canAddPoints: boolean, canAddWarehouses: boolean, createdAt: Date, updatedAt: Date);
    static create(props: {
        id: string;
        accountId: string;
        canAddEmployees?: boolean;
        canAddPoints?: boolean;
        canAddWarehouses?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    }): OrgSettingsEntity;
}
