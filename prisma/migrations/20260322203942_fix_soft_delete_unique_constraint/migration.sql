-- DropIndex
DROP INDEX "Product_sku_accountId_warehouseId_key";

-- CreateIndex (partial: only active products)
CREATE UNIQUE INDEX "Product_sku_accountId_warehouseId_active_key"
ON "Product" ("sku", "accountId", "warehouseId")
WHERE "deletedAt" IS NULL;
