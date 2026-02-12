import { OrgSettingsEntity } from '../entities/org-settings.entity';
export declare const ORG_SETTINGS_REPOSITORY = "ORG_SETTINGS_REPOSITORY";
export interface UpdateOrgSettingsData {
    canAddEmployees?: boolean;
    canAddPoints?: boolean;
    canAddWarehouses?: boolean;
    canAddProducts?: boolean;
}
export interface IOrgSettingsRepository {
    findByAccountId(accountId: string): Promise<OrgSettingsEntity | null>;
    upsert(accountId: string, data: UpdateOrgSettingsData): Promise<OrgSettingsEntity>;
}
