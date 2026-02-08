import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    IPointMemberRepository,
    CreatePointMemberData,
} from '@/domain/repositories/point-member.repository.interface';
import { PointMemberEntity } from '@/domain/entities/point-member.entity';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class PointMemberRepository implements IPointMemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<PointMemberEntity | null> {
        const member = await this.prisma.pointMember.findUnique({
            where: { id },
            include: { point: true },
        });

        if (!member) return null;

        return PointMemberEntity.create({
            ...member,
            role: member.role as UserRole,
            pointName: member.point.name,
        });
    }

    async findByPointId(pointId: string): Promise<PointMemberEntity[]> {
        const members = await this.prisma.pointMember.findMany({
            where: { pointId },
            include: { point: true },
        });

        return members.map((m) =>
            PointMemberEntity.create({
                ...m,
                role: m.role as UserRole,
                pointName: m.point.name,
            }),
        );
    }

    async findByUserId(userId: string): Promise<PointMemberEntity[]> {
        const members = await this.prisma.pointMember.findMany({
            where: { userId },
            include: { point: true },
        });

        return members.map((m) =>
            PointMemberEntity.create({
                ...m,
                role: m.role as UserRole,
                pointName: m.point.name,
            }),
        );
    }

    async findByPointAndUser(
        pointId: string,
        userId: string,
    ): Promise<PointMemberEntity | null> {
        const member = await this.prisma.pointMember.findUnique({
            where: {
                pointId_userId: {
                    pointId,
                    userId,
                },
            },
            include: { point: true },
        });

        if (!member) return null;

        return PointMemberEntity.create({
            ...member,
            role: member.role as UserRole,
            pointName: member.point.name,
        });
    }

    async create(data: CreatePointMemberData): Promise<PointMemberEntity> {
        const member = await this.prisma.pointMember.create({
            data: {
                pointId: data.pointId,
                userId: data.userId,
                role: (data.role as UserRole) ?? UserRole.POINT_ADMIN,
            },
            include: { point: true },
        });

        return PointMemberEntity.create({
            ...member,
            role: member.role as UserRole,
            pointName: member.point.name,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.pointMember.delete({
            where: { id },
        });
    }

    async deleteByPointAndUser(pointId: string, userId: string): Promise<void> {
        await this.prisma.pointMember.delete({
            where: {
                pointId_userId: {
                    pointId,
                    userId,
                },
            },
        });
    }
}
