-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canDeleteProducts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditProducts" BOOLEAN NOT NULL DEFAULT false;

-- Существующим сотрудникам сохраняем текущее поведение:
-- раньше редактирование и удаление товара были доступны по праву «Добавление товаров»
UPDATE "User" SET "canEditProducts" = true, "canDeleteProducts" = true WHERE "canAddProducts" = true;
