/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_orderId_key" ON "Transactions"("orderId");
