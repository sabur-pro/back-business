-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CashTransactionType" ADD VALUE 'CASH_TO_CARD';
ALTER TYPE "CashTransactionType" ADD VALUE 'CARD_TO_CASH';

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "cardAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "cashAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;
