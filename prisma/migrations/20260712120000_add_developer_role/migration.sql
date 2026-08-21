-- AlterEnum: add DEVELOPER role
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DEVELOPER';

-- AlterEnum: add SHIPMENT_DELETED audit action
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'SHIPMENT_DELETED';

-- AlterTable: track which developer impersonated an organizer for a refresh session
ALTER TABLE "RefreshToken" ADD COLUMN IF NOT EXISTS "impersonatorId" TEXT;
