/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `SaleItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `SaleItem` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `SaleItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `SaleItem` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalActual` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecommended` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRub` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalYuan` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualSalePrice` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceRub` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceYuan` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedSalePrice` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalActual` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecommended` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRub` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalYuan` to the `SaleItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('WAREHOUSE', 'SHOP');

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "totalAmount",
DROP COLUMN "totalCost",
DROP COLUMN "warehouseId",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "shopId" TEXT NOT NULL,
ADD COLUMN     "soldById" TEXT,
ADD COLUMN     "totalActual" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalRecommended" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalYuan" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "SaleItem" DROP COLUMN "costPrice",
DROP COLUMN "quantity",
DROP COLUMN "salePrice",
DROP COLUMN "totalAmount",
ADD COLUMN     "actualSalePrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "boxCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pairCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "priceRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "priceYuan" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "recommendedSalePrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "sizeRange" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "totalActual" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalRecommended" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalYuan" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canSell" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "type" "WarehouseType" NOT NULL DEFAULT 'WAREHOUSE';

-- CreateTable
CREATE TABLE "ShopEmployee" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShopEmployee_warehouseId_idx" ON "ShopEmployee"("warehouseId");

-- CreateIndex
CREATE INDEX "ShopEmployee_userId_idx" ON "ShopEmployee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopEmployee_warehouseId_userId_key" ON "ShopEmployee"("warehouseId", "userId");

-- CreateIndex
CREATE INDEX "Sale_shopId_idx" ON "Sale"("shopId");

-- CreateIndex
CREATE INDEX "Sale_accountId_idx" ON "Sale"("accountId");

-- CreateIndex
CREATE INDEX "Warehouse_type_idx" ON "Warehouse"("type");

-- AddForeignKey
ALTER TABLE "ShopEmployee" ADD CONSTRAINT "ShopEmployee_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopEmployee" ADD CONSTRAINT "ShopEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
