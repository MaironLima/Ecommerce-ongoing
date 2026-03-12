/*
  Warnings:

  - You are about to drop the column `name` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `product_variant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "product_variant_sku_key";

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "name",
DROP COLUMN "sku";
