/*
  Warnings:

  - A unique constraint covering the columns `[sku,accountId,warehouseId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_sku_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_accountId_warehouseId_key" ON "Product"("sku", "accountId", "warehouseId");
