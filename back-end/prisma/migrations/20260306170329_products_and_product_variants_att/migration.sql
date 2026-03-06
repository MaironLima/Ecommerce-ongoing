/*
  Warnings:

  - You are about to alter the column `base_price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `name` on the `product_variant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `product_variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attributes` to the `product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "base_price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "name",
ADD COLUMN     "attributes" JSONB NOT NULL,
ADD COLUMN     "price_override" DECIMAL(10,2),
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_sku_key" ON "product_variant"("sku");
