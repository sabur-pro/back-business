import { UpdateOrgSettingsDto, OrgSettingsResponseDto } from '@application/dto/settings';
import { GetOrgSettingsUseCase, UpdateOrgSettingsUseCase } from '@application/use-cases/settings';
export declare class SettingsController {
    private readonly getOrgSettingsUseCase;
    private readonly updateOrgSettingsUseCase;
    constructor(getOrgSettingsUseCase: GetOrgSettingsUseCase, updateOrgSettingsUseCase: UpdateOrgSettingsUseCase);
    getSettings(userId: string): Promise<OrgSettingsResponseDto>;
    updateSettings(userId: string, dto: UpdateOrgSettingsDto): Promise<OrgSettingsResponseDto>;
}
