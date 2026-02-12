import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma';
import { EmployeeController } from '@presentation/controllers';
import {
    UserRepository,
    AccountRepository,
    PointRepository,
    PointMemberRepository,
} from '@infrastructure/database/repositories';
import { HashService } from '@infrastructure/services/hash.service';
import {
    USER_REPOSITORY,
    ACCOUNT_REPOSITORY,
    POINT_REPOSITORY,
    POINT_MEMBER_REPOSITORY,
} from '@domain/repositories';
import { HASH_SERVICE } from '@infrastructure/services/hash.service';
import {
    CreateEmployeeUseCase,
    GetEmployeesUseCase,
    AssignPointUseCase,
    DeleteEmployeeUseCase,
    GetPointEmployeesUseCase,
    UnassignPointUseCase,
    UpdateEmployeePermissionsUseCase,
} from '@application/use-cases/employee';

@Module({
    imports: [PrismaModule],
    controllers: [EmployeeController],
    providers: [
        // Repositories
        { provide: USER_REPOSITORY, useClass: UserRepository },
        { provide: ACCOUNT_REPOSITORY, useClass: AccountRepository },
        { provide: POINT_REPOSITORY, useClass: PointRepository },
        { provide: POINT_MEMBER_REPOSITORY, useClass: PointMemberRepository },

        // Services
        { provide: HASH_SERVICE, useClass: HashService },

        // Use Cases
        CreateEmployeeUseCase,
        GetEmployeesUseCase,
        AssignPointUseCase,
        DeleteEmployeeUseCase,
        GetPointEmployeesUseCase,
        UnassignPointUseCase,
        UpdateEmployeePermissionsUseCase,
    ],
})
export class EmployeeModule { }
