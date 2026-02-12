-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_fromWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_toWarehouseId_fkey";

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "fromWarehouseId" DROP NOT NULL,
ALTER COLUMN "toWarehouseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
