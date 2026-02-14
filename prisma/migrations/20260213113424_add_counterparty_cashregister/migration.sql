-- CreateEnum
CREATE TYPE "CounterpartyType" AS ENUM ('SUPPLIER', 'CLIENT');

-- CreateEnum
CREATE TYPE "CounterpartyTransactionType" AS ENUM ('GOODS_RECEIVED', 'GOODS_SOLD', 'PAYMENT_OUT', 'PAYMENT_IN');

-- CreateEnum
CREATE TYPE "CashTransactionType" AS ENUM ('SALE_INCOME', 'PAYMENT_TO_SUPPLIER', 'PAYMENT_FROM_CLIENT', 'EXPENSE', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "GoodsReceipt" ADD COLUMN     "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "supplierId" TEXT;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "note" TEXT,
    "type" "CounterpartyType" NOT NULL,
    "accountId" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounterpartyTransaction" (
    "id" TEXT NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "type" "CounterpartyTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounterpartyTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashRegister" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashTransaction" (
    "id" TEXT NOT NULL,
    "cashRegisterId" TEXT NOT NULL,
    "type" "CashTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "counterpartyId" TEXT,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Counterparty_accountId_idx" ON "Counterparty"("accountId");

-- CreateIndex
CREATE INDEX "Counterparty_type_idx" ON "Counterparty"("type");

-- CreateIndex
CREATE INDEX "CounterpartyTransaction_counterpartyId_idx" ON "CounterpartyTransaction"("counterpartyId");

-- CreateIndex
CREATE UNIQUE INDEX "CashRegister_shopId_key" ON "CashRegister"("shopId");

-- CreateIndex
CREATE INDEX "CashRegister_shopId_idx" ON "CashRegister"("shopId");

-- CreateIndex
CREATE INDEX "CashTransaction_cashRegisterId_idx" ON "CashTransaction"("cashRegisterId");

-- CreateIndex
CREATE INDEX "GoodsReceipt_supplierId_idx" ON "GoodsReceipt"("supplierId");

-- CreateIndex
CREATE INDEX "Sale_clientId_idx" ON "Sale"("clientId");

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counterparty" ADD CONSTRAINT "Counterparty_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterpartyTransaction" ADD CONSTRAINT "CounterpartyTransaction_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashRegister" ADD CONSTRAINT "CashRegister_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashTransaction" ADD CONSTRAINT "CashTransaction_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "CashRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;
