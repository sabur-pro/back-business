/*
  Warnings:

  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - Added the required column `priceRub` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceYuan` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRub` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalYuan` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "unit",
ADD COLUMN     "boxCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pairCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "photoOriginal" TEXT,
ADD COLUMN     "priceRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "priceYuan" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "sizeRange" TEXT,
ADD COLUMN     "totalRub" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalYuan" DECIMAL(12,2) NOT NULL;
