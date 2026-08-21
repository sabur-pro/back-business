/**
 * Бэкфилл журнала поступлений (ProductArrival) по историческим данным.
 *
 * Источники:
 *   1. Принятые отправки (Transfer.status = CONFIRMED) + их позиции  → ArrivalSource.SHIPMENT
 *   2. Аудит-лог прихода (PRODUCT_CREATED / PRODUCT_BATCH_CREATED)   → ArrivalSource.RECEIPT
 *   3. Товары без единого поступления, но с остатком                 → ArrivalSource.MANUAL
 *
 * После создания партий проданные количества раскидываются по партиям методом FIFO,
 * а расхождение между остатком партий и фактическим остатком товара списывается
 * в returned у самых старых партий — чтобы «остаток прошлых дней» совпадал с реальным.
 *
 * Скрипт идемпотентный: партии, уже созданные по этому источнику, пропускаются.
 * Запуск локально:   node prisma/backfill-arrivals.js
 * В докере:          docker compose exec api node prisma/backfill-arrivals.js
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const num = (v) => (v === null || v === undefined ? 0 : Number(v));

/** Партии по принятым отправкам */
async function backfillFromShipments() {
    const transfers = await prisma.transfer.findMany({
        where: { status: 'CONFIRMED' },
        include: { items: true },
        orderBy: { createdAt: 'asc' },
    });

    let created = 0;
    let skipped = 0;

    for (const transfer of transfers) {
        const existing = await prisma.productArrival.count({
            where: { sourceType: 'SHIPMENT', sourceId: transfer.id },
        });
        if (existing > 0) {
            skipped++;
            continue;
        }

        const arrivedAt = transfer.receivedAt || transfer.confirmedAt || transfer.updatedAt;

        // Склады точки-получателя, чтобы найти, куда именно лёг товар
        const warehouses = await prisma.warehouse.findMany({
            where: { pointId: transfer.toPointId },
            select: { id: true, name: true, type: true },
        });
        if (warehouses.length === 0) continue;

        const shop = warehouses.find((w) => w.type === 'SHOP');

        const data = [];
        for (const item of transfer.items) {
            // Ищем товар получателя с этим артикулом — он и укажет склад
            const product = await prisma.product.findFirst({
                where: {
                    sku: item.sku,
                    accountId: transfer.toAccountId,
                    warehouseId: { in: warehouses.map((w) => w.id) },
                },
                orderBy: { createdAt: 'asc' },
            });

            const warehouseId = product?.warehouseId || shop?.id || warehouses[0].id;

            data.push({
                accountId: transfer.toAccountId,
                warehouseId,
                productId: product?.id ?? null,
                sku: item.sku,
                photo: item.photo,
                sizeRange: item.sizeRange,
                boxCount: item.boxCount,
                pairCount: item.pairCount,
                priceYuan: item.priceYuan,
                priceRub: item.priceRub,
                recommendedSalePrice: product ? product.recommendedSalePrice : 0,
                sourceType: 'SHIPMENT',
                sourceId: transfer.id,
                arrivedAt,
            });
        }

        if (data.length > 0) {
            await prisma.productArrival.createMany({ data });
            created += data.length;
        }
    }

    console.log(`  Отправки: создано партий ${created}, пропущено отправок (уже есть) ${skipped}`);
}

/** Партии по приходу товара (аудит-лог) */
async function backfillFromReceipts() {
    const logs = await prisma.auditLog.findMany({
        where: { action: { in: ['PRODUCT_CREATED', 'PRODUCT_BATCH_CREATED'] } },
        orderBy: { createdAt: 'asc' },
    });

    let created = 0;
    let skipped = 0;

    for (const log of logs) {
        const existing = await prisma.productArrival.count({
            where: { sourceType: 'RECEIPT', sourceId: log.id },
        });
        if (existing > 0) {
            skipped++;
            continue;
        }

        const d = log.newData;
        if (!d || !d.sku) continue;

        const product = await prisma.product.findUnique({ where: { id: log.entityId } });
        const warehouseId = d.warehouseId || product?.warehouseId;
        if (!warehouseId) continue;

        const pairCount = num(d.pairCount);
        const boxCount = num(d.boxCount);
        if (pairCount <= 0 && boxCount <= 0) continue;

        await prisma.productArrival.create({
            data: {
                accountId: log.accountId,
                warehouseId,
                productId: product?.id ?? null,
                sku: d.sku,
                photo: d.photo ?? null,
                sizeRange: d.sizeRange ?? null,
                boxCount,
                pairCount,
                priceYuan: num(d.priceYuan),
                priceRub: num(d.priceRub),
                recommendedSalePrice: num(d.recommendedSalePrice),
                sourceType: 'RECEIPT',
                sourceId: log.id,
                arrivedAt: log.createdAt,
            },
        });
        created++;
    }

    console.log(`  Приход: создано партий ${created}, пропущено записей (уже есть) ${skipped}`);
}

/** Раскидать проданное по партиям (FIFO) и выровнять остаток с фактическим */
async function distributeSoldAndAlign() {
    const products = await prisma.product.findMany({
        where: { deletedAt: null },
        select: { id: true, boxCount: true, pairCount: true },
    });

    let touched = 0;

    for (const product of products) {
        const arrivals = await prisma.productArrival.findMany({
            where: { productId: product.id },
            orderBy: { arrivedAt: 'asc' },
        });
        if (arrivals.length === 0) continue;

        const soldAgg = await prisma.saleItem.aggregate({
            where: { productId: product.id, sale: { status: 'COMPLETED' } },
            _sum: { boxCount: true, pairCount: true },
        });

        let soldBoxesLeft = num(soldAgg._sum.boxCount);
        let soldPairsLeft = num(soldAgg._sum.pairCount);

        const plan = arrivals.map((a) => {
            const boxes = Math.min(a.boxCount, soldBoxesLeft);
            const pairs = Math.min(a.pairCount, soldPairsLeft);
            soldBoxesLeft -= boxes;
            soldPairsLeft -= pairs;
            return { id: a.id, soldBoxes: boxes, soldPairs: pairs, boxCount: a.boxCount, pairCount: a.pairCount, returnedBoxes: 0, returnedPairs: 0 };
        });

        // Остаток партий не должен превышать фактический остаток товара:
        // разницу (ручные правки, списания) гасим в самых старых партиях
        let boxExcess = plan.reduce((s, p) => s + (p.boxCount - p.soldBoxes), 0) - product.boxCount;
        let pairExcess = plan.reduce((s, p) => s + (p.pairCount - p.soldPairs), 0) - product.pairCount;

        for (const p of plan) {
            if (boxExcess > 0) {
                const take = Math.min(boxExcess, p.boxCount - p.soldBoxes);
                p.returnedBoxes = take;
                boxExcess -= take;
            }
            if (pairExcess > 0) {
                const take = Math.min(pairExcess, p.pairCount - p.soldPairs);
                p.returnedPairs = take;
                pairExcess -= take;
            }
        }

        await prisma.$transaction(
            plan.map((p) =>
                prisma.productArrival.update({
                    where: { id: p.id },
                    data: {
                        soldBoxes: p.soldBoxes,
                        soldPairs: p.soldPairs,
                        returnedBoxes: p.returnedBoxes,
                        returnedPairs: p.returnedPairs,
                    },
                }),
            ),
        );
        touched += plan.length;
    }

    console.log(`  Распределено проданное по партиям: ${touched}`);
}

/** Товары с остатком, но без единой партии — создаём партию «неизвестного происхождения» */
async function backfillOrphanStock() {
    const products = await prisma.product.findMany({
        where: { deletedAt: null, warehouseId: { not: null } },
        include: { arrivals: { select: { id: true }, take: 1 } },
    });

    const orphans = products.filter(
        (p) => p.arrivals.length === 0 && (p.pairCount > 0 || p.boxCount > 0),
    );

    if (orphans.length === 0) {
        console.log('  Товаров без истории поступления нет');
        return;
    }

    await prisma.productArrival.createMany({
        data: orphans.map((p) => ({
            accountId: p.accountId,
            warehouseId: p.warehouseId,
            productId: p.id,
            sku: p.sku,
            photo: p.photo,
            sizeRange: p.sizeRange,
            boxCount: p.boxCount,
            pairCount: p.pairCount,
            priceYuan: p.priceYuan,
            priceRub: p.priceRub,
            recommendedSalePrice: p.recommendedSalePrice,
            sourceType: 'MANUAL',
            sourceId: null,
            arrivedAt: p.createdAt,
        })),
    });

    console.log(`  Товаров без истории поступления: создано партий ${orphans.length}`);
}

/** Проставить товарам дату последнего поступления */
async function syncLastArrivedAt() {
    const updated = await prisma.$executeRaw`
        UPDATE "Product" p
        SET "lastArrivedAt" = a."maxArrived"
        FROM (
            SELECT "productId", MAX("arrivedAt") AS "maxArrived"
            FROM "ProductArrival"
            WHERE "productId" IS NOT NULL
            GROUP BY "productId"
        ) a
        WHERE p."id" = a."productId"
          AND (p."lastArrivedAt" IS NULL OR p."lastArrivedAt" <> a."maxArrived")
    `;
    console.log(`  Дата последнего поступления проставлена товарам: ${updated}`);
}

async function main() {
    console.log('Бэкфилл журнала поступлений...');
    await backfillFromShipments();
    await backfillFromReceipts();
    await distributeSoldAndAlign();
    await backfillOrphanStock();
    await syncLastArrivedAt();

    const total = await prisma.productArrival.count();
    console.log(`Готово. Всего партий в журнале: ${total}`);
}

main()
    .catch((e) => {
        console.error('Ошибка бэкфилла:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
