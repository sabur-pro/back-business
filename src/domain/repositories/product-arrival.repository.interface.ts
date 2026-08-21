import { ProductArrivalEntity, ArrivalSource } from '../entities/product-arrival.entity';

export interface CreateArrivalData {
    accountId: string;
    warehouseId: string;
    productId?: string | null;
    sku: string;
    photo?: string | null;
    sizeRange?: string | null;
    boxCount: number;
    pairCount: number;
    priceYuan: number;
    priceRub: number;
    recommendedSalePrice?: number;
    sourceType: ArrivalSource;
    sourceId?: string | null;
    arrivedAt: Date;
}

/** Статус дня: NEW — ничего не продано, PARTIAL — часть, DONE — остатка нет */
export type ArrivalDayStatus = 'NEW' | 'PARTIAL' | 'DONE';

export interface ArrivalDaySummary {
    date: string; // YYYY-MM-DD в часовом поясе запроса
    arrivalsCount: number;
    boxCount: number;
    pairCount: number;
    soldBoxes: number;
    soldPairs: number;
    returnedBoxes: number;
    returnedPairs: number;
    remainderBoxes: number;
    remainderPairs: number;
    totalCostRub: number;
    totalRecommended: number;
    status: ArrivalDayStatus;
}

export interface ApplyArrivalDeltaData {
    id: string;
    boxCount: number;
    pairCount: number;
}

/**
 * Product Arrival Repository Interface
 */
export interface IProductArrivalRepository {
    createMany(data: CreateArrivalData[]): Promise<void>;
    findById(id: string): Promise<ProductArrivalEntity | null>;
    /** Партии, поступившие в интервале [from, to) */
    findByWarehouseAndRange(warehouseId: string, from: Date, to: Date): Promise<ProductArrivalEntity[]>;
    /** Непроданный и невозвращённый остаток партий, пришедших до указанной даты */
    findRemaindersBefore(warehouseId: string, before: Date): Promise<ProductArrivalEntity[]>;
    /** Сводка по дням поступлений */
    getDaysSummary(
        warehouseId: string,
        from: Date,
        to: Date,
        tzOffsetMinutes: number,
    ): Promise<ArrivalDaySummary[]>;
    /** Увеличить счётчик проданного из партий */
    incrementSold(items: ApplyArrivalDeltaData[]): Promise<void>;
    /** Уменьшить счётчик проданного (отмена продажи) */
    decrementSold(items: ApplyArrivalDeltaData[]): Promise<void>;
    /** Увеличить счётчик возвращённого из партий */
    incrementReturned(items: ApplyArrivalDeltaData[]): Promise<void>;
}

export const PRODUCT_ARRIVAL_REPOSITORY = Symbol('IProductArrivalRepository');
