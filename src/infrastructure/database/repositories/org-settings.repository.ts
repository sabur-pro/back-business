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
            canAddProducts: settings.canAddProducts,
            hardDeleteProducts: settings.hardDeleteProducts,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        });
    }

    async upsert(accountId: string, data: UpdateOrgSettingsData): Promise<OrgSettingsEntity> {
        const updateData: any = {};
        if (data.canAddEmployees !== undefined) updateData.canAddEmployees = data.canAddEmployees;
        if (data.canAddPoints !== undefined) updateData.canAddPoints = data.canAddPoints;
        if (data.canAddWarehouses !== undefined) updateData.canAddWarehouses = data.canAddWarehouses;
        if (data.canAddProducts !== undefined) updateData.canAddProducts = data.canAddProducts;
        if (data.hardDeleteProducts !== undefined) updateData.hardDeleteProducts = data.hardDeleteProducts;

        const settings = await this.prisma.orgSettings.upsert({
            where: { accountId },
            create: {
                accountId,
                canAddEmployees: data.canAddEmployees ?? true,
                canAddPoints: data.canAddPoints ?? true,
                canAddWarehouses: data.canAddWarehouses ?? true,
                canAddProducts: data.canAddProducts ?? false,
                hardDeleteProducts: data.hardDeleteProducts ?? false,
            },
            update: updateData,
        });

        return OrgSettingsEntity.create({
            id: settings.id,
            accountId: settings.accountId,
            canAddEmployees: settings.canAddEmployees,
            canAddPoints: settings.canAddPoints,
            canAddWarehouses: settings.canAddWarehouses,
            canAddProducts: settings.canAddProducts,
            hardDeleteProducts: settings.hardDeleteProducts,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
        });
    }
}
