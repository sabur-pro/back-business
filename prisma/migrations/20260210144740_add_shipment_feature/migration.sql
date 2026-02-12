/*
  Warnings:

  - You are about to drop the column `originalAmount` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `remainingAmount` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `TransferItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `TransferItem` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `TransferItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `TransferItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku,accountId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creditorAccountId` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debtorAccountId` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalAmountRub` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalAmountYuan` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingAmountRub` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingAmountYuan` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromAccountId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromWarehouseId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAccountId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toWarehouseId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRub` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalYuan` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceRub` to the `TransferItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceYuan` to the `TransferItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `TransferItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRub` to the `TransferItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalYuan` to the `TransferItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "originalAmount",
DROP COLUMN "remainingAmount",
ADD COLUMN     "creditorAccountId" TEXT NOT NULL,
ADD COLUMN     "debtorAccountId" TEXT NOT NULL,
ADD COLUMN     "originalAmountRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "originalAmountYuan" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "remainingAmountRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "remainingAmountYuan" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "Transfer" DROP COLUMN "totalAmount",
ADD COLUMN     "fromAccountId" TEXT NOT NULL,
ADD COLUMN     "fromWarehouseId" TEXT NOT NULL,
ADD COLUMN     "receivedAt" TIMESTAMP(3),
ADD COLUMN     "receiverWaybillPhoto" TEXT,
ADD COLUMN     "toAccountId" TEXT NOT NULL,
ADD COLUMN     "toWarehouseId" TEXT NOT NULL,
ADD COLUMN     "totalRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalYuan" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "transportPhoto" TEXT,
ADD COLUMN     "waybillPhoto" TEXT;

-- AlterTable
ALTER TABLE "TransferItem" DROP COLUMN "costPrice",
DROP COLUMN "quantity",
DROP COLUMN "salePrice",
DROP COLUMN "totalAmount",
ADD COLUMN     "boxCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pairCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "priceRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "priceYuan" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "sizeRange" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "totalRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalYuan" DECIMAL(12,2) NOT NULL;

-- CreateIndex
CREATE INDEX "Debt_creditorAccountId_idx" ON "Debt"("creditorAccountId");

-- CreateIndex
CREATE INDEX "Debt_debtorAccountId_idx" ON "Debt"("debtorAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_accountId_key" ON "Product"("sku", "accountId");

-- CreateIndex
CREATE INDEX "Transfer_fromAccountId_idx" ON "Transfer"("fromAccountId");

-- CreateIndex
CREATE INDEX "Transfer_toAccountId_idx" ON "Transfer"("toAccountId");

-- CreateIndex
CREATE INDEX "Transfer_fromWarehouseId_idx" ON "Transfer"("fromWarehouseId");

-- CreateIndex
CREATE INDEX "Transfer_toWarehouseId_idx" ON "Transfer"("toWarehouseId");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_creditorAccountId_fkey" FOREIGN KEY ("creditorAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_debtorAccountId_fkey" FOREIGN KEY ("debtorAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
