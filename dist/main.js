"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Warehouse Management API')
        .setDescription('API для системы складского учёта')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Auth', 'Аутентификация и авторизация')
        .addTag('Accounts', 'Управление аккаунтами')
        .addTag('Points', 'Управление точками')
        .addTag('Warehouses', 'Управление складами')
        .addTag('Products', 'Управление товарами')
        .addTag('GoodsReceipts', 'Приход товаров')
        .addTag('Transfers', 'Перемещение товаров')
        .addTag('Sales', 'Продажа товаров')
        .addTag('Debts', 'Учёт долгов')
        .addTag('Payments', 'Платежи')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map