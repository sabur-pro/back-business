-- CreateEnum
CREATE TYPE "ArrivalSource" AS ENUM ('SHIPMENT', 'RECEIPT', 'MANUAL');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "lastArrivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN "arrivalDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SaleItem" ADD COLUMN "arrivalId" TEXT;

-- CreateTable
CREATE TABLE "ProductArrival" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT,
    "sku" TEXT NOT NULL,
    "photo" TEXT,
    "sizeRange" TEXT,
    "boxCount" INTEGER NOT NULL DEFAULT 0,
    "pairCount" INTEGER NOT NULL DEFAULT 0,
    "soldBoxes" INTEGER NOT NULL DEFAULT 0,
    "soldPairs" INTEGER NOT NULL DEFAULT 0,
    "returnedBoxes" INTEGER NOT NULL DEFAULT 0,
    "returnedPairs" INTEGER NOT NULL DEFAULT 0,
    "priceYuan" DECIMAL(12,2) NOT NULL,
    "priceRub" DECIMAL(12,2) NOT NULL,
    "recommendedSalePrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sourceType" "ArrivalSource" NOT NULL DEFAULT 'SHIPMENT',
    "sourceId" TEXT,
    "arrivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductArrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReturn" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "totalBoxes" INTEGER NOT NULL DEFAULT 0,
    "totalPairs" INTEGER NOT NULL DEFAULT 0,
    "totalYuan" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalRub" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReturnItem" (
    "id" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "arrivalId" TEXT,
    "productId" TEXT,
    "sku" TEXT NOT NULL,
    "photo" TEXT,
    "sizeRange" TEXT,
    "boxCount" INTEGER NOT NULL DEFAULT 0,
    "pairCount" INTEGER NOT NULL DEFAULT 0,
    "priceYuan" DECIMAL(12,2) NOT NULL,
    "priceRub" DECIMAL(12,2) NOT NULL,
    "totalYuan" DECIMAL(12,2) NOT NULL,
    "totalRub" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ProductReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_lastArrivedAt_idx" ON "Product"("lastArrivedAt");

-- CreateIndex
CREATE INDEX "ProductArrival_warehouseId_arrivedAt_idx" ON "ProductArrival"("warehouseId", "arrivedAt");

-- CreateIndex
CREATE INDEX "ProductArrival_accountId_idx" ON "ProductArrival"("accountId");

-- CreateIndex
CREATE INDEX "ProductArrival_productId_idx" ON "ProductArrival"("productId");

-- CreateIndex
CREATE INDEX "ProductArrival_sku_idx" ON "ProductArrival"("sku");

-- CreateIndex
CREATE INDEX "ProductArrival_sourceType_sourceId_idx" ON "ProductArrival"("sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReturn_number_key" ON "ProductReturn"("number");

-- CreateIndex
CREATE INDEX "ProductReturn_shopId_idx" ON "ProductReturn"("shopId");

-- CreateIndex
CREATE INDEX "ProductReturn_accountId_idx" ON "ProductReturn"("accountId");

-- CreateIndex
CREATE INDEX "ProductReturn_arrivalDate_idx" ON "ProductReturn"("arrivalDate");

-- CreateIndex
CREATE INDEX "ProductReturn_number_idx" ON "ProductReturn"("number");

-- CreateIndex
CREATE INDEX "ProductReturnItem_returnId_idx" ON "ProductReturnItem"("returnId");

-- CreateIndex
CREATE INDEX "ProductReturnItem_arrivalId_idx" ON "ProductReturnItem"("arrivalId");

-- CreateIndex
CREATE INDEX "ProductReturnItem_productId_idx" ON "ProductReturnItem"("productId");

-- CreateIndex
CREATE INDEX "SaleItem_arrivalId_idx" ON "SaleItem"("arrivalId");

-- AddForeignKey
ALTER TABLE "ProductArrival" ADD CONSTRAINT "ProductArrival_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductArrival" ADD CONSTRAINT "ProductArrival_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturn" ADD CONSTRAINT "ProductReturn_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturnItem" ADD CONSTRAINT "ProductReturnItem_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "ProductReturn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturnItem" ADD CONSTRAINT "ProductReturnItem_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "ProductArrival"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturnItem" ADD CONSTRAINT "ProductReturnItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_arrivalId_fkey" FOREIGN KEY ("arrivalId") REFERENCES "ProductArrival"("id") ON DELETE SET NULL ON UPDATE CASCADE;
