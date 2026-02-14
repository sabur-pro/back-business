/*
  Warnings:

  - You are about to drop the column `canManageCounterparties` on the `OrgSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrgSettings" DROP COLUMN "canManageCounterparties";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAddProducts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageCounterparties" BOOLEAN NOT NULL DEFAULT false;
