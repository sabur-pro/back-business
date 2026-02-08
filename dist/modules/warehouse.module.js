"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../infrastructure/database/prisma");
const controllers_1 = require("../presentation/controllers");
const repositories_1 = require("../infrastructure/database/repositories");
const repositories_2 = require("../domain/repositories");
const warehouse_1 = require("../application/use-cases/warehouse");
let WarehouseModule = class WarehouseModule {
};
exports.WarehouseModule = WarehouseModule;
exports.WarehouseModule = WarehouseModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [controllers_1.WarehouseController],
        providers: [
            {
                provide: repositories_2.WAREHOUSE_REPOSITORY,
                useClass: repositories_1.WarehouseRepository,
            },
            {
                provide: repositories_2.POINT_REPOSITORY,
                useClass: repositories_1.PointRepository,
            },
            warehouse_1.CreateWarehouseUseCase,
            warehouse_1.GetWarehousesUseCase,
            warehouse_1.UpdateWarehouseUseCase,
            warehouse_1.DeleteWarehouseUseCase,
        ],
        exports: [repositories_2.WAREHOUSE_REPOSITORY, repositories_2.POINT_REPOSITORY],
    })
], WarehouseModule);
//# sourceMappingURL=warehouse.module.js.map