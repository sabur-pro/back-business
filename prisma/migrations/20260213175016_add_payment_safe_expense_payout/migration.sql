-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CashTransactionType" ADD VALUE 'SALE_INCOME_CARD';
ALTER TYPE "CashTransactionType" ADD VALUE 'TRANSFER_TO_SAFE';
ALTER TYPE "CashTransactionType" ADD VALUE 'TRANSFER_FROM_SAFE';
ALTER TYPE "CashTransactionType" ADD VALUE 'CARD_TO_SAFE';
ALTER TYPE "CashTransactionType" ADD VALUE 'SAFE_TO_CARD';
ALTER TYPE "CashTransactionType" ADD VALUE 'PAYOUT_CASH';
ALTER TYPE "CashTransactionType" ADD VALUE 'PAYOUT_SAFE';
ALTER TYPE "CashTransactionType" ADD VALUE 'PAYOUT_CARD';

-- AlterTable
ALTER TABLE "CashRegister" ADD COLUMN     "cardBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "safeBalance" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH';

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "cashRegisterId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "cashRegisterId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "cashAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "safeAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cardAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_cashRegisterId_idx" ON "Expense"("cashRegisterId");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_number_key" ON "Payout"("number");

-- CreateIndex
CREATE INDEX "Payout_cashRegisterId_idx" ON "Payout"("cashRegisterId");

-- CreateIndex
CREATE INDEX "Payout_shopId_idx" ON "Payout"("shopId");

-- CreateIndex
CREATE INDEX "Payout_accountId_idx" ON "Payout"("accountId");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE INDEX "Payout_number_idx" ON "Payout"("number");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "CashRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "CashRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;
