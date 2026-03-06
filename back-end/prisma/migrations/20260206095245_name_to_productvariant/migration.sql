/*
  Warnings:

  - Added the required column `name` to the `product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variant" ADD COLUMN     "name" TEXT NOT NULL;
