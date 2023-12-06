/*
  Warnings:

  - You are about to alter the column `orderId` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "orderId" SET DATA TYPE INTEGER;
