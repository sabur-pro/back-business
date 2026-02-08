-- CreateTable
CREATE TABLE "OrgSettings" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "canAddEmployees" BOOLEAN NOT NULL DEFAULT true,
    "canAddPoints" BOOLEAN NOT NULL DEFAULT true,
    "canAddWarehouses" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrgSettings_accountId_key" ON "OrgSettings"("accountId");

-- CreateIndex
CREATE INDEX "OrgSettings_accountId_idx" ON "OrgSettings"("accountId");

-- AddForeignKey
ALTER TABLE "OrgSettings" ADD CONSTRAINT "OrgSettings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
