-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "actualSalePrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "recommendedSalePrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalActualSale" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalRecommendedSale" DECIMAL(12,2) NOT NULL DEFAULT 0;
