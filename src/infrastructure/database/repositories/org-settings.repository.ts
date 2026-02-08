import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IOrgSettingsRepository,
    UpdateOrgSettingsData,
} from '@domain/repositories/org-settings.repository.interface';
import { OrgSettingsEntity } from '@domain/entities/org-settings.entity';

@Injectable()
export class OrgSettingsRepository implements IOrgSettingsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByAccountId(accountId: string): Promise<OrgSettingsEntity | null> {
        const settings = await this.prisma.orgSettings.findUnique({
            where: { accountId },
        });

        if (!settings) return null;

        return OrgSettingsEntity.create({
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        });
    }

    async upsert(accountId: string, data: UpdateOrgSettingsData): Promise<OrgSettingsEntity> {
        const settings = await this.prisma.orgSettings.upsert({
            where: { accountId },
            create: {
                accountId,
                canAddEmployees: data.canAddEmployees ?? true,
                canAddPoints: data.canAddPoints ?? true,
                canAddWarehouses: data.canAddWarehouses ?? true,
            },
            update: {
                canAddEmployees: data.canAddEmployees,
                canAddPoints: data.canAddPoints,
                canAddWarehouses: data.canAddWarehouses,
            },
        });

        return OrgSettingsEntity.create({
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        });
    }
}
