/*
  Warnings:

  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Permissions" ADD VALUE 'SUPERADMIN';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT NOT NULL;
