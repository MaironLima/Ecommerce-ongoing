/*
  Warnings:

  - You are about to drop the column `slug` on the `category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "category_slug_key";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");
