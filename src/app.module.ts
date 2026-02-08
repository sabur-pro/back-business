import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { WarehouseModule } from './modules/warehouse.module';
import { OrganizationModule } from './modules/organization.module';
import { EmployeeModule } from './modules/employee.module';
import { SettingsModule } from './modules/settings.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        AuthModule,
        WarehouseModule,
        OrganizationModule,
        EmployeeModule,
        SettingsModule,
    ],
})
export class AppModule { }


