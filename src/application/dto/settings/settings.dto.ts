import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateOrgSettingsDto {
    @ApiProperty({ description: 'Разрешить добавление сотрудников', required: false })
    @IsBoolean()
    @IsOptional()
    canAddEmployees?: boolean;

    @ApiProperty({ description: 'Разрешить добавление точек', required: false })
    @IsBoolean()
    @IsOptional()
    canAddPoints?: boolean;

    @ApiProperty({ description: 'Разрешить добавление складов', required: false })
    @IsBoolean()
    @IsOptional()
    canAddWarehouses?: boolean;

    @ApiProperty({ description: 'Разрешить админу точки добавлять товары', required: false })
    @IsBoolean()
    @IsOptional()
    canAddProducts?: boolean;

}

export class OrgSettingsResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    accountId: string;

    @ApiProperty()
    canAddEmployees: boolean;

    @ApiProperty()
    canAddPoints: boolean;

    @ApiProperty()
    canAddWarehouses: boolean;

    @ApiProperty()
    canAddProducts: boolean;
}
