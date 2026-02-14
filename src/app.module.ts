import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { WarehouseModule } from './modules/warehouse.module';
import { OrganizationModule } from './modules/organization.module';
import { EmployeeModule } from './modules/employee.module';
import { SettingsModule } from './modules/settings.module';
import { ProductModule } from './modules/product.module';
import { UploadModule } from './modules/upload.module';
import { ShipmentModule } from './modules/shipment.module';
import { ShopModule } from './modules/shop.module';
import { SaleModule } from './modules/sale.module';
import { CounterpartyModule } from './modules/counterparty.module';
import { CashRegisterModule } from './modules/cash-register.module';
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
        ProductModule,
        UploadModule,
        ShipmentModule,
        ShopModule,
        SaleModule,
        CounterpartyModule,
        CashRegisterModule,
    ],
})
export class AppModule { }


