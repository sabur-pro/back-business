import { PrismaService } from '../prisma/prisma.service';
import { IOrgSettingsRepository, UpdateOrgSettingsData } from '@domain/repositories/org-settings.repository.interface';
import { OrgSettingsEntity } from '@domain/entities/org-settings.entity';
export declare class OrgSettingsRepository implements IOrgSettingsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByAccountId(accountId: string): Promise<OrgSettingsEntity | null>;
    upsert(accountId: string, data: UpdateOrgSettingsData): Promise<OrgSettingsEntity>;
}
