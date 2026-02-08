-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ORGANIZER', 'POINT_ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ORGANIZER';

-- CreateTable
CREATE TABLE "PointMember" (
    "id" TEXT NOT NULL,
    "pointId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'POINT_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PointMember_pointId_idx" ON "PointMember"("pointId");

-- CreateIndex
CREATE INDEX "PointMember_userId_idx" ON "PointMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PointMember_pointId_userId_key" ON "PointMember"("pointId", "userId");

-- CreateIndex
CREATE INDEX "User_accountId_idx" ON "User"("accountId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointMember" ADD CONSTRAINT "PointMember_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointMember" ADD CONSTRAINT "PointMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
