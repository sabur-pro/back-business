-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canCreateShipment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canReceiveShipment" BOOLEAN NOT NULL DEFAULT false;
