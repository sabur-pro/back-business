import { ShopEmployeeEntity } from '../entities/shop-employee.entity';

export interface CreateShopEmployeeData {
    warehouseId: string;
    userId: string;
}

/**
 * ShopEmployee Repository Interface
 */
export interface IShopEmployeeRepository {
    findById(id: string): Promise<ShopEmployeeEntity | null>;
    findByShopId(warehouseId: string): Promise<ShopEmployeeEntity[]>;
    findByUserId(userId: string): Promise<ShopEmployeeEntity[]>;
    findByShopAndUser(warehouseId: string, userId: string): Promise<ShopEmployeeEntity | null>;
    create(data: CreateShopEmployeeData): Promise<ShopEmployeeEntity>;
    delete(id: string): Promise<void>;
    deleteByShopAndUser(warehouseId: string, userId: string): Promise<void>;
}

export const SHOP_EMPLOYEE_REPOSITORY = Symbol('IShopEmployeeRepository');
